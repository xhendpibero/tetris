import {
  isValidPosition,
  canMoveTo,
  checkBoundaryCollision,
  checkBoardCollision,
  getLowestValidPosition,
  getPieceBottomY,
  getPieceLeftmostX,
  getPieceRightmostX,
  isGameOver,
  getCollisionInfo
} from '../../src/core/utils/collision.utils'
import { BoardState, CellState } from '../../src/core/types/board.types'
import { BOARD_WIDTH, BOARD_HEIGHT } from '../../src/core/constants/game.constants'

describe('Collision Detection', () => {
  let emptyBoard: BoardState
  let boardWithPieces: BoardState

  beforeEach(() => {
    // Create empty board
    emptyBoard = {
      grid: Array(BOARD_HEIGHT).fill(null).map(() => 
        Array(BOARD_WIDTH).fill(null)
      ),
      width: BOARD_WIDTH,
      height: BOARD_HEIGHT,
      visibleHeight: 20
    }

    // Create board with some filled cells
    boardWithPieces = {
      grid: Array(BOARD_HEIGHT).fill(null).map(() => 
        Array(BOARD_WIDTH).fill(null)
      ),
      width: BOARD_WIDTH,
      height: BOARD_HEIGHT,
      visibleHeight: 20
    }

    // Add some filled cells at the bottom of the visible area (last row)
    const bottomRow = BOARD_HEIGHT - 1
    for (let col = 0; col < 5; col++) {
      boardWithPieces.grid[bottomRow][col] = {
        filled: true,
        color: '#FF0000',
        pieceType: 'T'
      }
    }
  })

  describe('Basic Position Validation', () => {
    const tShape = [
      [false, true, false],
      [true, true, true],
      [false, false, false]
    ]

    test('should validate position on empty board', () => {
      expect(isValidPosition(3, 18, tShape, emptyBoard)).toBe(true)
      expect(isValidPosition(0, 0, tShape, emptyBoard)).toBe(true)
    })

    test('should detect left wall collision', () => {
      expect(isValidPosition(-1, 10, tShape, emptyBoard)).toBe(false)
      expect(isValidPosition(-2, 10, tShape, emptyBoard)).toBe(false)
    })

    test('should detect right wall collision', () => {
      // T-shape is 3 blocks wide, so at position x=7, it occupies columns 7,8,9
      expect(isValidPosition(BOARD_WIDTH - 3, 10, tShape, emptyBoard)).toBe(true) // x=7, fits
      expect(isValidPosition(BOARD_WIDTH - 2, 10, tShape, emptyBoard)).toBe(false) // x=8, overflows
      expect(isValidPosition(BOARD_WIDTH - 1, 10, tShape, emptyBoard)).toBe(false) // x=9, overflows
    })

    test('should detect floor collision', () => {
      expect(isValidPosition(3, BOARD_HEIGHT - 2, tShape, emptyBoard)).toBe(true)
      expect(isValidPosition(3, BOARD_HEIGHT - 1, tShape, emptyBoard)).toBe(false)
      expect(isValidPosition(3, BOARD_HEIGHT, tShape, emptyBoard)).toBe(false)
    })

    test('should allow spawn positions above visible area', () => {
      expect(isValidPosition(3, -2, tShape, emptyBoard)).toBe(true)
      expect(isValidPosition(3, 0, tShape, emptyBoard)).toBe(true)
    })
  })

  describe('Board Collision Detection', () => {
    const iShape = [
      [true, true, true, true]
    ]

    test('should detect collision with existing pieces', () => {
      const filledRow = BOARD_HEIGHT - 1
      expect(isValidPosition(0, filledRow, iShape, boardWithPieces)).toBe(false)
      expect(isValidPosition(5, filledRow, iShape, boardWithPieces)).toBe(true)
    })

    test('should allow placement above existing pieces', () => {
      const rowAbove = BOARD_HEIGHT - 2
      expect(isValidPosition(0, rowAbove, iShape, boardWithPieces)).toBe(true)
    })
  })

  describe('Boundary Collision Detection', () => {
    const lShape = [
      [false, false, true],
      [true, true, true],
      [false, false, false]
    ]

    test('should detect individual boundary collisions', () => {
      const leftCollision = checkBoundaryCollision(-1, 10, lShape)
      expect(leftCollision.left).toBe(true)
      expect(leftCollision.right).toBe(false)
      expect(leftCollision.bottom).toBe(false)
      expect(leftCollision.top).toBe(false)

      const rightCollision = checkBoundaryCollision(BOARD_WIDTH - 1, 10, lShape)
      expect(rightCollision.right).toBe(true)
      expect(rightCollision.left).toBe(false)

      const bottomCollision = checkBoundaryCollision(3, BOARD_HEIGHT - 1, lShape)
      expect(bottomCollision.bottom).toBe(true)

      const topCollision = checkBoundaryCollision(3, -1, lShape)
      expect(topCollision.top).toBe(true)
    })
  })

  describe('Board Collision Check', () => {
    const oShape = [
      [true, true],
      [true, true]
    ]

    test('should detect board collision', () => {
      const filledRow = BOARD_HEIGHT - 1
      expect(checkBoardCollision(0, filledRow, oShape, boardWithPieces)).toBe(true)
      expect(checkBoardCollision(5, filledRow, oShape, boardWithPieces)).toBe(false)
    })

    test('should not detect collision on empty board', () => {
      expect(checkBoardCollision(0, BOARD_HEIGHT - 1, oShape, emptyBoard)).toBe(false)
    })
  })

  describe('Lowest Valid Position', () => {
    const jShape = [
      [true, false, false],
      [true, true, true],
      [false, false, false]
    ]

    test('should find lowest position on empty board', () => {
      const lowestY = getLowestValidPosition(3, 0, jShape, emptyBoard)
      expect(lowestY).toBe(BOARD_HEIGHT - 2) // Should land on the floor
    })

    test('should find lowest position above existing pieces', () => {
      const lowestY = getLowestValidPosition(0, 2, jShape, boardWithPieces)
      expect(lowestY).toBe(BOARD_HEIGHT - 3)
    })

    test('should handle starting position at bottom', () => {
      const lowestY = getLowestValidPosition(5, BOARD_HEIGHT - 2, jShape, emptyBoard)
      expect(lowestY).toBe(BOARD_HEIGHT - 2) // Already at lowest valid position
    })
  })

  describe('Piece Boundary Calculations', () => {
    const sShape = [
      [false, true, true],
      [true, true, false],
      [false, false, false]
    ]

    test('should calculate piece bottom Y', () => {
      expect(getPieceBottomY(10, sShape)).toBe(11) // y + 1 for the bottom row
    })

    test('should calculate leftmost X', () => {
      expect(getPieceLeftmostX(5, sShape)).toBe(5) // Left edge of the piece
    })

    test('should calculate rightmost X', () => {
      expect(getPieceRightmostX(5, sShape)).toBe(7) // x + 2 for rightmost block
    })
  })

  describe('Game Over Detection', () => {
    test('should not detect game over on empty board', () => {
      expect(isGameOver(emptyBoard)).toBe(false)
    })

    test('should detect game over when spawn area is blocked', () => {
      // Fill a cell in the spawn area (top hidden rows - indices 0 and 1)
      const gameOverBoard = { ...emptyBoard }
      gameOverBoard.grid[0][5] = {
        filled: true,
        color: '#FF0000',
        pieceType: 'I'
      }

      expect(isGameOver(gameOverBoard)).toBe(true)
    })

    test('should not detect game over for pieces in visible area only', () => {
      // boardWithPieces has pieces only in visible area
      expect(isGameOver(boardWithPieces)).toBe(false)
    })
  })

  describe('Comprehensive Collision Info', () => {
    const tShape = [
      [false, true, false],
      [true, true, true],
      [false, false, false]
    ]

    test('should provide complete collision information', () => {
      const info = getCollisionInfo(3, 10, tShape, emptyBoard)

      expect(info.isValid).toBe(true)
      expect(info.boundary.left).toBe(false)
      expect(info.boundary.right).toBe(false)
      expect(info.boundary.bottom).toBe(false)
      expect(info.boundary.top).toBe(false)
      expect(info.boardCollision).toBe(false)
      expect(info.canMoveLeft).toBe(true)
      expect(info.canMoveRight).toBe(true)
      expect(info.canMoveDown).toBe(true)
      expect(typeof info.lowestY).toBe('number')
    })

    test('should detect movement restrictions', () => {
      const info = getCollisionInfo(0, 10, tShape, emptyBoard)

      expect(info.canMoveLeft).toBe(false) // Against left wall
      expect(info.canMoveRight).toBe(true)
    })

    test('should detect collision with board pieces', () => {
      // T-shape at position (0, 18) would occupy rows 18 and 19
      // Row 19 has pieces in columns 0-4, so there should be a collision
      const info = getCollisionInfo(0, BOARD_HEIGHT - 2, tShape, boardWithPieces)

      expect(info.canMoveDown).toBe(false) // Would collide with pieces at bottom row
      expect(info.boardCollision).toBe(true) // Current position overlaps with existing pieces at bottom row
    })
  })

  describe('canMoveTo wrapper function', () => {
    const iShape = [
      [true, true, true, true]
    ]

    test('should work as wrapper for isValidPosition', () => {
      const position = { x: 3, y: 10 }
      const result1 = canMoveTo(position, iShape, emptyBoard)
      const result2 = isValidPosition(position.x, position.y, iShape, emptyBoard)

      expect(result1).toBe(result2)
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty shape', () => {
      const emptyShape: boolean[][] = []
      expect(isValidPosition(0, 0, emptyShape, emptyBoard)).toBe(true)
    })

    test('should handle shape with no filled blocks', () => {
      const emptyShape = [
        [false, false],
        [false, false]
      ]
      expect(isValidPosition(0, 0, emptyShape, emptyBoard)).toBe(true)
    })

    test('should handle board boundary edge cases', () => {
      const singleBlock = [[true]]
      
      expect(isValidPosition(-1, 0, singleBlock, emptyBoard)).toBe(false)
      expect(isValidPosition(BOARD_WIDTH, 0, singleBlock, emptyBoard)).toBe(false)
      expect(isValidPosition(0, BOARD_HEIGHT, singleBlock, emptyBoard)).toBe(false)
      expect(isValidPosition(0, -1, singleBlock, emptyBoard)).toBe(true)
    })
  })
})
