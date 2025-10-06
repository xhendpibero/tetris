import { createLineClearSystem, LineClearSystem } from '../../src/game/LineClearSystem'
import {
  BOARD_HEIGHT,
  BOARD_VISIBLE_HEIGHT,
  BOARD_WIDTH,
  ANIMATION_DURATIONS,
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

const fillRow = (board: BoardState, rowIndex: number, pieceType: CellState['pieceType'], color: string) => {
  for (let col = 0; col < board.width; col++) {
    board.grid[rowIndex][col] = {
      filled: true,
      pieceType,
      color,
    }
  }
}

describe('LineClearSystem', () => {
  let system: LineClearSystem
  let board: BoardState

  beforeEach(() => {
    system = createLineClearSystem()
    board = createEmptyBoard()
  })

  test('detects single line clear', () => {
    fillRow(board, 18, 'T', '#f0f')

    const result = system.checkForLineClears(board)

    expect(result.hasClears).toBe(true)
    expect(result.clearedLines).toEqual([18])
    expect(result.cellsToClear).toHaveLength(BOARD_WIDTH)
    expect(result.animationDuration).toBe(ANIMATION_DURATIONS.lineClearTotal)
    expect(result.inputLockDuration).toBe(ANIMATION_DURATIONS.lineClearTotal)
  })

  test('applies single line clear and drops rows', () => {
    // Fill bottom row and add a block above it to ensure it drops
    fillRow(board, 19, 'L', '#fa0')
    board.grid[18][0] = {
      filled: true,
      pieceType: 'J',
      color: '#00f',
    }

    const applyResult = system.applyLineClear(board, [19])
    const updated = applyResult.board

    expect(applyResult.linesCleared).toBe(1)
    expect(updated.grid[19][0]).toEqual({ filled: true, pieceType: 'J', color: '#00f' })
    expect(updated.grid[18][0]).toBeNull()
    expect(updated.grid[0].every((cell) => cell === null)).toBe(true)
  })

  test('handles multiple line clears simultaneously', () => {
    fillRow(board, 17, 'I', '#0ff')
    fillRow(board, 18, 'I', '#0ff')
    fillRow(board, 19, 'I', '#0ff')
    board.grid[16][5] = {
      filled: true,
      pieceType: 'T',
      color: '#f0f',
    }

    const applyResult = system.applyLineClear(board, [19, 17, 18])
    const updated = applyResult.board

    expect(applyResult.linesCleared).toBe(3)
    expect(applyResult.clearedLineIndices).toEqual([17, 18, 19])
    expect(updated.grid[19][5]).toEqual({ filled: true, pieceType: 'T', color: '#f0f' })
    expect(updated.grid[16][5]).toBeNull()
  })

  test('ignores hidden rows when checking for clears', () => {
    fillRow(board, BOARD_VISIBLE_HEIGHT, 'S', '#0f0')

    const result = system.checkForLineClears(board)
    expect(result.hasClears).toBe(false)
  })
})
