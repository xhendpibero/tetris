import { ANIMATION_DURATIONS } from '../core/constants/game.constants'
import { BoardState, CellState } from '../core/types/board.types'
import { Position } from '../core/types/piece.types'

export interface LineClearCheckResult {
  hasClears: boolean
  clearedLines: number[]
  cellsToClear: Position[]
  animationDuration: number
  inputLockDuration: number
}

export interface LineClearApplyResult {
  board: BoardState
  linesCleared: number
  clearedLineIndices: number[]
}

const cloneCell = (cell: CellState): CellState => {
  if (!cell) {
    return null
  }

  return {
    filled: cell.filled,
    color: cell.color,
    pieceType: cell.pieceType,
  }
}

const cloneBoard = (board: BoardState): BoardState => ({
  width: board.width,
  height: board.height,
  visibleHeight: board.visibleHeight,
  grid: board.grid.map((row) => row.map(cloneCell)),
})

const createEmptyRow = (width: number): CellState[] => {
  return Array.from({ length: width }, () => null)
}

export class LineClearSystem {
  checkForLineClears(board: BoardState): LineClearCheckResult {
    const clearedLines: number[] = []
    const cellsToClear: Position[] = []

    for (let row = 0; row < board.visibleHeight; row++) {
      const isComplete = board.grid[row].every((cell) => cell?.filled)

      if (isComplete) {
        clearedLines.push(row)

        for (let col = 0; col < board.width; col++) {
          cellsToClear.push({ x: col, y: row })
        }
      }
    }

    return {
      hasClears: clearedLines.length > 0,
      clearedLines,
      cellsToClear,
      animationDuration: ANIMATION_DURATIONS.lineClearTotal,
      inputLockDuration: ANIMATION_DURATIONS.lineClearTotal,
    }
  }

  applyLineClear(board: BoardState, clearedLines: number[]): LineClearApplyResult {
    if (!clearedLines.length) {
      return {
        board: cloneBoard(board),
        linesCleared: 0,
        clearedLineIndices: [],
      }
    }

    const sortedLines = [...clearedLines].sort((a, b) => a - b)
    const newBoard = cloneBoard(board)

    for (const rowIndex of sortedLines) {
      this.removeRow(newBoard, rowIndex)
    }

    return {
      board: newBoard,
      linesCleared: sortedLines.length,
      clearedLineIndices: sortedLines,
    }
  }

  private removeRow(board: BoardState, rowIndex: number): void {
    for (let row = rowIndex; row > 0; row--) {
      board.grid[row] = board.grid[row - 1].map(cloneCell)
    }

    board.grid[0] = createEmptyRow(board.width)
  }
}

export const createLineClearSystem = (): LineClearSystem => new LineClearSystem()
