import {
  LOCK_DELAY,
  LOCK_DELAY_MAX_RESETS,
  calculateGravitySpeed,
} from '../core/constants/game.constants'
import { BoardState } from '../core/types/board.types'
import { Piece } from './Piece'
import { Position } from '../core/types/piece.types'
import { isValidPosition } from '../core/utils/collision.utils'

export interface GravityOptions {
  level?: number
  lockDelay?: number
  maxLockResets?: number
  overrideGravitySpeed?: number
}

export interface GravityUpdateResult {
  movedRows: number
  locked: boolean
  lockCells?: Position[]
}

const clonePosition = (position: Position): Position => ({ ...position })

export class GravitySystem {
  private board: BoardState
  private piece: Piece

  private level: number
  private readonly lockDelay: number
  private readonly maxLockResets: number
  private gravityInterval: number

  private accumulator = 0
  private lockTimer = 0
  private lockResets = 0
  private grounded = false
  private pieceLocked = false

  constructor(board: BoardState, piece: Piece, options: GravityOptions = {}) {
    this.board = board
    this.piece = piece

    this.level = options.level ?? 1
    this.lockDelay = options.lockDelay ?? LOCK_DELAY
    this.maxLockResets = options.maxLockResets ?? LOCK_DELAY_MAX_RESETS

    const speedOverride = options.overrideGravitySpeed
    this.gravityInterval = speedOverride ?? calculateGravitySpeed(this.level)
  }

  setPiece(piece: Piece): void {
    this.piece = piece
    this.resetTimers()
    this.pieceLocked = false
    this.refreshGroundedState()
  }

  setLevel(level: number): void {
    if (level < 1) {
      throw new Error('Level must be at least 1')
    }
    this.level = level
    this.gravityInterval = calculateGravitySpeed(level)
  }

  setBoard(board: BoardState): void {
    this.board = board
    this.refreshGroundedState()
  }

  update(deltaMs: number): GravityUpdateResult {
    if (this.pieceLocked) {
      return { movedRows: 0, locked: true }
    }

    this.accumulator += deltaMs
    let movedRows = 0

    while (this.accumulator >= this.gravityInterval && !this.pieceLocked) {
      this.accumulator -= this.gravityInterval

      if (this.tryMoveDown()) {
        movedRows += 1
        continue
      }

      this.accumulator = 0
      break
    }

    this.refreshGroundedState()

    if (!this.grounded) {
      this.lockTimer = 0
      this.lockResets = 0
    } else {
      this.lockTimer += deltaMs

      if (this.lockTimer >= this.lockDelay) {
        const lockCells = this.lockPiece()
        this.pieceLocked = true
        return { movedRows, locked: true, lockCells }
      }
    }

    return { movedRows, locked: this.pieceLocked }
  }

  notifyPieceAction(): void {
    if (this.pieceLocked) {
      return
    }

    const wasGrounded = this.grounded
    this.refreshGroundedState()

    if (wasGrounded && this.grounded && this.lockResets < this.maxLockResets) {
      this.lockTimer = 0
      this.lockResets += 1
    }
  }

  isPieceLocked(): boolean {
    return this.pieceLocked
  }

  getBoardState(): BoardState {
    return {
      grid: this.board.grid.map((row) => row.map((cell) => (cell ? { ...cell } : null))),
      width: this.board.width,
      height: this.board.height,
      visibleHeight: this.board.visibleHeight,
    }
  }

  getPiece(): Piece {
    return this.piece
  }

  getGravityInterval(): number {
    return this.gravityInterval
  }

  getLockTimer(): number {
    return this.lockTimer
  }

  getLockResets(): number {
    return this.lockResets
  }

  forceLock(): Position[] {
    if (this.pieceLocked) {
      return []
    }

    const lockedCells = this.lockPiece()
    this.pieceLocked = true
    return lockedCells
  }

  private tryMoveDown(): boolean {
    const moved = this.piece.moveDown(this.board)

    if (moved) {
      this.grounded = false
      this.lockTimer = 0
      this.lockResets = 0
      return true
    }

    this.grounded = true
    return false
  }

  private refreshGroundedState(): void {
    const position = this.piece.getPosition()
    const shape = this.piece.getShape()

    this.grounded = !isValidPosition(
      position.x,
      position.y + 1,
      shape,
      this.board,
    )
  }

  private lockPiece(): Position[] {
    const cells = this.piece.getOccupiedCells()
    const lockedCells: Position[] = []

    for (const cell of cells) {
      if (
        cell.y >= 0 &&
        cell.y < this.board.height &&
        cell.x >= 0 &&
        cell.x < this.board.width
      ) {
        this.board.grid[cell.y][cell.x] = {
          filled: true,
          color: this.piece.color,
          pieceType: this.piece.type,
        }
        lockedCells.push(clonePosition(cell))
      }
    }

    return lockedCells
  }

  private resetTimers(): void {
    this.accumulator = 0
    this.lockTimer = 0
    this.lockResets = 0
    this.grounded = false
  }
}
