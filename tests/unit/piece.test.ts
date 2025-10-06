import { Piece, createPiece } from '../../src/game/Piece'
import { BOARD_HEIGHT, BOARD_VISIBLE_HEIGHT, BOARD_WIDTH } from '../../src/core/constants/game.constants'
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

describe('Piece', () => {
  let board: BoardState

  beforeEach(() => {
    board = createEmptyBoard()
  })

  describe('Spawning', () => {
    test('should spawn using piece definitions', () => {
      const piece = Piece.spawn('T', board)
      expect(piece.getRotation()).toBe(0)
      expect(piece.getShape()).toBeDefined()
      expect(piece.getPosition()).toEqual({ x: 3, y: 20 })
    })

    test('should throw when spawn position is blocked', () => {
      board.grid[21][3] = {
        filled: true,
        color: '#000',
        pieceType: 'I',
      }

      expect(() => Piece.spawn('T', board)).toThrow('Cannot spawn piece: spawn position is obstructed')
    })
  })

  describe('Movement', () => {
    test('should move left, right, and down when space is free', () => {
      const piece = createPiece('L', { position: { x: 4, y: 10 } })

      expect(piece.moveLeft(board)).toBe(true)
      expect(piece.getPosition()).toEqual({ x: 3, y: 10 })

      expect(piece.moveRight(board)).toBe(true)
      expect(piece.getPosition()).toEqual({ x: 4, y: 10 })

      expect(piece.moveDown(board)).toBe(true)
      expect(piece.getPosition()).toEqual({ x: 4, y: 11 })
    })

    test('should stop movement when blocked by wall or filled cell', () => {
      const piece = createPiece('T', { position: { x: 0, y: 10 } })

      expect(piece.moveLeft(board)).toBe(false)
      expect(piece.getPosition()).toEqual({ x: 0, y: 10 })

      board.grid[12][0] = {
        filled: true,
        color: '#fff',
        pieceType: 'I',
      }

      expect(piece.moveDown(board)).toBe(false)
      expect(piece.getPosition()).toEqual({ x: 0, y: 10 })
    })
  })

  describe('Rotation', () => {
    test('should rotate clockwise using SRS wall kicks near left wall', () => {
      const piece = createPiece('J', { position: { x: 0, y: 10 } })

      expect(piece.rotate(board)).toBe(true)
      expect(piece.getRotation()).toBe(1)
      expect(piece.isPositionValid(board)).toBe(true)
    })

    test('should rotate counter-clockwise using wall kicks near right wall', () => {
      const piece = createPiece('T', { position: { x: BOARD_WIDTH - 3, y: 10 } })

      expect(piece.rotate(false, board)).toBe(true)
      expect(piece.getRotation()).toBe(3)
      expect(piece.isPositionValid(board)).toBe(true)
    })

    test('should use I-piece wall kick data correctly', () => {
      const piece = createPiece('I', { position: { x: BOARD_WIDTH - 4, y: 10 } })

      expect(piece.rotate(board)).toBe(true)
      expect(piece.getRotation()).toBe(1)
      expect(piece.isPositionValid(board)).toBe(true)
    })

    test('should keep O-piece orientation unchanged', () => {
      const piece = createPiece('O', { position: { x: 4, y: 10 } })

      expect(piece.rotate(board)).toBe(true)
      expect(piece.getRotation()).toBe(0)
    })
  })

  describe('Drop mechanics', () => {
    test('should hard drop to the lowest valid position', () => {
      const piece = createPiece('S', { position: { x: 3, y: 10 } })

      board.grid[18][4] = {
        filled: true,
        color: '#0f0',
        pieceType: 'Z',
      }

      const distance = piece.hardDrop(board)
      expect(distance).toBeGreaterThan(0)
      expect(piece.isPositionValid(board)).toBe(true)
      expect(piece.getPosition().y).toBeLessThanOrEqual(18)
    })
  })

  describe('Utility', () => {
    test('should return occupied cells for the current shape', () => {
      const piece = createPiece('I', { position: { x: 2, y: 3 } })
      const cells = piece.getOccupiedCells()

      expect(cells).toHaveLength(4)
      expect(cells[0]).toEqual({ x: 2, y: 4 })
    })

    test('clone should duplicate current state', () => {
      const original = createPiece('Z', { position: { x: 5, y: 6 }, rotation: 2 })
      const copy = original.clone()

      expect(copy.getPosition()).toEqual(original.getPosition())
      expect(copy.getRotation()).toBe(original.getRotation())

      original.moveDown(board)
      expect(copy.getPosition()).not.toEqual(original.getPosition())
    })
  })
})
