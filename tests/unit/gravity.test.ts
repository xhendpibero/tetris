import { GravitySystem } from '../../src/game/GravitySystem'
import { createPiece } from '../../src/game/Piece'
import {
  BOARD_HEIGHT,
  BOARD_VISIBLE_HEIGHT,
  BOARD_WIDTH,
  LOCK_DELAY,
  LOCK_DELAY_MAX_RESETS,
} from '../../src/core/constants/game.constants'
import { BoardState, CellState } from '../../src/core/types/board.types'

const createEmptyBoard = (): BoardState => {
  const grid: CellState[][] = Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null),
  )

  return {
    grid,
    width: BOARD_WIDTH,
    height: BOARD_HEIGHT,
    visibleHeight: BOARD_VISIBLE_HEIGHT,
  }
}

describe('GravitySystem', () => {
  test('should move piece down when enough time passes', () => {
    const board = createEmptyBoard()
    const piece = createPiece('T', { position: { x: 3, y: 0 } })
    const gravity = new GravitySystem(board, piece, { overrideGravitySpeed: 1000 })

    const interval = gravity.getGravityInterval()

    const firstTick = gravity.update(interval / 2)
    expect(firstTick.movedRows).toBe(0)
    expect(piece.getPosition().y).toBe(0)

    const secondTick = gravity.update(interval / 2)
    expect(secondTick.movedRows).toBe(1)
    expect(piece.getPosition().y).toBe(1)
    expect(secondTick.locked).toBe(false)
  })

  test('should move multiple rows with large delta', () => {
    const board = createEmptyBoard()
    const piece = createPiece('I', { position: { x: 0, y: 0 } })
    const gravity = new GravitySystem(board, piece, { overrideGravitySpeed: 100 })

    const interval = gravity.getGravityInterval()
    const result = gravity.update(interval * 3)

    expect(result.movedRows).toBe(3)
    expect(piece.getPosition().y).toBe(3)
    expect(result.locked).toBe(false)
  })

  test('should lock piece after lock delay when grounded', () => {
    const board = createEmptyBoard()
    const piece = createPiece('O', { position: { x: 4, y: BOARD_HEIGHT - 3 } })
    const gravity = new GravitySystem(board, piece, { overrideGravitySpeed: 100 })

    const interval = gravity.getGravityInterval()

    // Drop piece onto the floor
    gravity.update(interval) // move down once (now resting on the floor)
    const groundTick = gravity.update(interval) // grounded during this tick
    expect(groundTick.movedRows).toBe(0)
    expect(gravity.getLockTimer()).toBe(interval * 2)

    const remainingToLock = LOCK_DELAY - gravity.getLockTimer()
    const lockResult = gravity.update(remainingToLock)

    expect(lockResult.locked).toBe(true)
    expect(lockResult.lockCells).toHaveLength(4)

    for (const cell of lockResult.lockCells ?? []) {
      const boardCell = board.grid[cell.y]?.[cell.x]
      expect(boardCell?.filled).toBe(true)
      expect(boardCell?.pieceType).toBe('O')
    }
  })

  test('should reset lock delay on movement until reset limit reached', () => {
    const board = createEmptyBoard()
    const piece = createPiece('T', { position: { x: 4, y: BOARD_HEIGHT - 3 } })
    const gravity = new GravitySystem(board, piece, { overrideGravitySpeed: 100 })

    const interval = gravity.getGravityInterval()

    // Drop onto the floor
    gravity.update(interval)
    gravity.update(interval)

    // Accumulate lock time to stay just below the locking threshold
    const targetTimer = LOCK_DELAY - 50
    const initialTimer = gravity.getLockTimer()
    gravity.update(targetTimer - initialTimer)
    expect(gravity.getLockTimer()).toBe(targetTimer)

    // Alternate left/right movements to reset lock delay
    for (let i = 0; i < LOCK_DELAY_MAX_RESETS; i++) {
      const moveLeft = i % 2 === 0
      const moved = moveLeft ? piece.moveLeft(board) : piece.moveRight(board)
      expect(moved).toBe(true)

      gravity.notifyPieceAction()
      expect(gravity.getLockTimer()).toBe(0)

      // Rebuild the timer for the next reset attempt
      gravity.update(targetTimer)
    }

    expect(gravity.getLockResets()).toBe(LOCK_DELAY_MAX_RESETS)

    const timerBeforeLimit = gravity.getLockTimer()
    expect(timerBeforeLimit).toBe(targetTimer)

    // Attempting another reset should not clear the timer
    piece.moveLeft(board)
    gravity.notifyPieceAction()
    expect(gravity.getLockTimer()).toBe(timerBeforeLimit)
    expect(gravity.getLockResets()).toBe(LOCK_DELAY_MAX_RESETS)

    // Allow timer to complete and lock the piece
    const finalTick = gravity.update(LOCK_DELAY - timerBeforeLimit)
    expect(finalTick.locked).toBe(true)
    expect(gravity.isPieceLocked()).toBe(true)
  })

  test('should force lock immediately when requested', () => {
    const board = createEmptyBoard()
    const piece = createPiece('O', { position: { x: 4, y: BOARD_HEIGHT - 2 } })
    const gravity = new GravitySystem(board, piece, { overrideGravitySpeed: 100 })

    gravity.forceLock()

    expect(gravity.isPieceLocked()).toBe(true)

    const snapshot = gravity.getBoardState()
    expect(snapshot.grid[BOARD_HEIGHT - 2][4]?.filled).toBe(true)
    expect(snapshot.grid[BOARD_HEIGHT - 1][5]?.filled).toBe(true)
  })
})
