import { BoardState, CellState } from '../types/board.types'
import { Position } from '../types/piece.types'
import { BOARD_WIDTH, BOARD_HEIGHT } from '../constants/game.constants'

export const isValidPosition = (
  x: number, 
  y: number, 
  shape: boolean[][], 
  board: BoardState
): boolean => {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const boardX = x + col
        const boardY = y + row

        // Check boundary collisions
        if (boardX < 0 || boardX >= BOARD_WIDTH) {
          return false // Wall collision
        }

        if (boardY >= BOARD_HEIGHT) {
          return false // Floor collision
        }

        // Check board collision (existing pieces)
        if (boardY >= 0 && board.grid[boardY] && board.grid[boardY][boardX]) {
          const cell = board.grid[boardY][boardX]
          if (cell && cell.filled) {
            return false // Collision with existing piece
          }
        }
      }
    }
  }

  return true
}

export const canMoveTo = (
  position: Position, 
  shape: boolean[][], 
  board: BoardState
): boolean => {
  return isValidPosition(position.x, position.y, shape, board)
}

export const checkBoundaryCollision = (
  x: number, 
  y: number, 
  shape: boolean[][]
): { 
  left: boolean; 
  right: boolean; 
  bottom: boolean; 
  top: boolean 
} => {
  let left = false
  let right = false
  let bottom = false
  let top = false

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const boardX = x + col
        const boardY = y + row

        if (boardX < 0) left = true
        if (boardX >= BOARD_WIDTH) right = true
        if (boardY >= BOARD_HEIGHT) bottom = true
        if (boardY < 0) top = true
      }
    }
  }

  return { left, right, bottom, top }
}

export const checkBoardCollision = (
  x: number, 
  y: number, 
  shape: boolean[][], 
  board: BoardState
): boolean => {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const boardX = x + col
        const boardY = y + row

        // Only check if position is within board bounds
        if (
          boardX >= 0 && 
          boardX < BOARD_WIDTH && 
          boardY >= 0 && 
          boardY < BOARD_HEIGHT
        ) {
          const cell = board.grid[boardY]?.[boardX]
          if (cell && cell.filled) {
            return true // Collision detected
          }
        }
      }
    }
  }

  return false // No collision
}

export const getLowestValidPosition = (
  x: number, 
  startY: number, 
  shape: boolean[][], 
  board: BoardState
): number => {
  let y = startY

  // Move down until we hit something
  while (isValidPosition(x, y + 1, shape, board)) {
    y++
  }

  return y
}

export const getPieceBottomY = (y: number, shape: boolean[][]): number => {
  let bottomY = y

  for (let row = shape.length - 1; row >= 0; row--) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        bottomY = Math.max(bottomY, y + row)
        break
      }
    }
  }

  return bottomY
}

export const getPieceLeftmostX = (x: number, shape: boolean[][]): number => {
  let leftmostX = x + shape[0].length

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        leftmostX = Math.min(leftmostX, x + col)
        break
      }
    }
  }

  return leftmostX
}

export const getPieceRightmostX = (x: number, shape: boolean[][]): number => {
  let rightmostX = x - 1

  for (let row = 0; row < shape.length; row++) {
    for (let col = shape[row].length - 1; col >= 0; col--) {
      if (shape[row][col]) {
        rightmostX = Math.max(rightmostX, x + col)
        break
      }
    }
  }

  return rightmostX
}

export const isGameOver = (board: BoardState): boolean => {
  // Spawn area lives in the hidden rows above the visible playfield
  const hiddenRows = board.height - board.visibleHeight

  for (let row = 0; row < hiddenRows; row++) {
    for (let col = 0; col < board.width; col++) {
      const cell = board.grid[row]?.[col]
      if (cell && cell.filled) {
        return true
      }
    }
  }

  return false
}

export const getCollisionInfo = (
  x: number, 
  y: number, 
  shape: boolean[][], 
  board: BoardState
) => {
  const boundary = checkBoundaryCollision(x, y, shape)
  const boardCollision = checkBoardCollision(x, y, shape, board)
  const isValid = isValidPosition(x, y, shape, board)

  return {
    isValid,
    boundary,
    boardCollision,
    canMoveLeft: isValidPosition(x - 1, y, shape, board),
    canMoveRight: isValidPosition(x + 1, y, shape, board),
    canMoveDown: isValidPosition(x, y + 1, shape, board),
    lowestY: getLowestValidPosition(x, y, shape, board)
  }
}
