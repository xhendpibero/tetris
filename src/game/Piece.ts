import { BoardState } from '../core/types/board.types'
import {
  PieceDefinition,
  PieceState,
  PieceType,
  Position,
  Rotation,
} from '../core/types/piece.types'
import { PIECE_DEFINITIONS } from '../core/constants/pieces.constants'
import {
  getNextRotation,
  getWallKickData,
} from '../core/constants/srs.constants'
import {
  getLowestValidPosition,
  isValidPosition,
} from '../core/utils/collision.utils'

const clonePosition = (position: Position): Position => ({ ...position })

export interface PieceOptions {
  rotation?: Rotation
  position?: Position
}

export class Piece {
  readonly type: PieceType
  readonly color: string

  private rotation: Rotation
  private position: Position
  private readonly definition: PieceDefinition

  constructor(type: PieceType, options: PieceOptions = {}) {
    this.definition = PIECE_DEFINITIONS[type]
    this.type = type
    this.color = this.definition.color
    this.rotation = (options.rotation ?? 0) as Rotation
    this.position = clonePosition(options.position ?? this.definition.spawnPosition)
  }

  static spawn(type: PieceType, board?: BoardState): Piece {
    const piece = new Piece(type)

    if (board && !piece.isPositionValid(board)) {
      throw new Error('Cannot spawn piece: spawn position is obstructed')
    }

    return piece
  }

  clone(): Piece {
    return new Piece(this.type, {
      rotation: this.rotation,
      position: clonePosition(this.position),
    })
  }

  getRotation(): Rotation {
    return this.rotation
  }

  getPosition(): Position {
    return clonePosition(this.position)
  }

  getShape(): boolean[][] {
    return this.definition.shapes[this.rotation]
  }

  getState(): PieceState {
    return {
      type: this.type,
      rotation: this.rotation,
      position: this.getPosition(),
      shape: this.getShape(),
      color: this.color,
    }
  }

  getOccupiedCells(): Position[] {
    const shape = this.getShape()
    const cells: Position[] = []

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          cells.push({
            x: this.position.x + col,
            y: this.position.y + row,
          })
        }
      }
    }

    return cells
  }

  moveLeft(board: BoardState): boolean {
    return this.tryMove(this.position.x - 1, this.position.y, board)
  }

  moveRight(board: BoardState): boolean {
    return this.tryMove(this.position.x + 1, this.position.y, board)
  }

  moveDown(board: BoardState): boolean {
    return this.tryMove(this.position.x, this.position.y + 1, board)
  }

  hardDrop(board: BoardState): number {
    const targetY = getLowestValidPosition(
      this.position.x,
      this.position.y,
      this.getShape(),
      board,
    )

    const distance = targetY - this.position.y
    this.position = { x: this.position.x, y: targetY }
    return distance
  }

  rotate(clockwise: boolean, board: BoardState): boolean
  rotate(board: BoardState): boolean
  rotate(arg1: boolean | BoardState, arg2?: BoardState): boolean {
    const clockwise = typeof arg1 === 'boolean' ? arg1 : true
    const board = (typeof arg1 === 'boolean' ? arg2 : arg1) as BoardState

    if (this.type === 'O') {
      return true
    }

    const fromRotation = this.rotation
    const toRotation = getNextRotation(fromRotation, clockwise) as Rotation
    const targetShape = this.definition.shapes[toRotation]

    const kicks = getWallKickData(this.type, fromRotation, toRotation)

    if (!kicks.length) {
      if (isValidPosition(this.position.x, this.position.y, targetShape, board)) {
        this.rotation = toRotation
        return true
      }
      return false
    }

    for (const offset of kicks) {
      const newX = this.position.x + offset.x
      const newY = this.position.y - offset.y

      if (isValidPosition(newX, newY, targetShape, board)) {
        this.position = { x: newX, y: newY }
        this.rotation = toRotation
        return true
      }
    }

    return false
  }

  isPositionValid(board: BoardState): boolean {
    const shape = this.getShape()
    return isValidPosition(this.position.x, this.position.y, shape, board)
  }

  setPosition(position: Position): void {
    this.position = clonePosition(position)
  }

  private tryMove(x: number, y: number, board: BoardState): boolean {
    if (isValidPosition(x, y, this.getShape(), board)) {
      this.position = { x, y }
      return true
    }

    return false
  }
}

export const createPiece = (type: PieceType, options?: PieceOptions): Piece => {
  return new Piece(type, options)
}
