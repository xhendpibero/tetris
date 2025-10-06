import { 
  SevenBagRandomizer, 
  getRandomizer, 
  getNextPiece, 
  peekNextPieces, 
  resetRandomizer,
  getRandomizerProgress 
} from '../../src/core/utils/randomizer.utils'
import { ALL_PIECE_TYPES } from '../../src/core/constants/pieces.constants'
import { PieceType } from '../../src/core/types/piece.types'

describe('SevenBagRandomizer', () => {
  let randomizer: SevenBagRandomizer

  beforeEach(() => {
    randomizer = new SevenBagRandomizer()
  })

  describe('Basic Functionality', () => {
    test('should generate a piece from available types', () => {
      const piece = randomizer.getNextPiece()
      expect(ALL_PIECE_TYPES).toContain(piece)
    })

    test('should generate all 7 pieces in one bag', () => {
      const generatedPieces: PieceType[] = []
      
      for (let i = 0; i < 7; i++) {
        generatedPieces.push(randomizer.getNextPiece())
      }

      expect(generatedPieces).toHaveLength(7)
      
      // Check that all piece types are present
      for (const pieceType of ALL_PIECE_TYPES) {
        expect(generatedPieces).toContain(pieceType)
      }
    })

    test('should start a new bag after 7 pieces', () => {
      // Generate first bag
      const firstBag: PieceType[] = []
      for (let i = 0; i < 7; i++) {
        firstBag.push(randomizer.getNextPiece())
      }

      // Generate second bag
      const secondBag: PieceType[] = []
      for (let i = 0; i < 7; i++) {
        secondBag.push(randomizer.getNextPiece())
      }

      // Both bags should contain all pieces
      const sortedFirstBag = [...firstBag].sort()
      const sortedSecondBag = [...secondBag].sort()
      const sortedPieceTypes = [...ALL_PIECE_TYPES].sort()

      expect(sortedFirstBag).toEqual(sortedPieceTypes)
      expect(sortedSecondBag).toEqual(sortedPieceTypes)
    })
  })

  describe('Distribution Testing', () => {
    test('should have equal distribution over many bags', () => {
      const pieceCount: Record<PieceType, number> = {
        I: 0, O: 0, T: 0, S: 0, Z: 0, J: 0, L: 0
      }

      const totalPieces = 1000 // ~142 complete bags
      
      for (let i = 0; i < totalPieces; i++) {
        const piece = randomizer.getNextPiece()
        pieceCount[piece]++
      }

      // Each piece should appear approximately the same number of times
      const expectedCount = totalPieces / 7
      const tolerance = 5 // Allow some variance due to incomplete final bag

      for (const pieceType of ALL_PIECE_TYPES) {
        expect(pieceCount[pieceType]).toBeGreaterThanOrEqual(expectedCount - tolerance)
        expect(pieceCount[pieceType]).toBeLessThanOrEqual(expectedCount + tolerance)
      }
    })

    test('should never have more than 2 consecutive identical pieces', () => {
      const pieces: PieceType[] = []
      
      // Generate 500 pieces (enough to test across multiple bags)
      for (let i = 0; i < 500; i++) {
        pieces.push(randomizer.getNextPiece())
      }

      // Check for consecutive pieces
      let maxConsecutive = 1
      let currentConsecutive = 1
      
      for (let i = 1; i < pieces.length; i++) {
        if (pieces[i] === pieces[i - 1]) {
          currentConsecutive++
        } else {
          maxConsecutive = Math.max(maxConsecutive, currentConsecutive)
          currentConsecutive = 1
        }
      }
      
      maxConsecutive = Math.max(maxConsecutive, currentConsecutive)
      expect(maxConsecutive).toBeLessThanOrEqual(2)
    })
  })

  describe('Peek Functionality', () => {
    test('should peek next piece without consuming it', () => {
      const peeked = randomizer.peekNextPieces(1)
      const actual = randomizer.getNextPiece()
      
      expect(peeked).toHaveLength(1)
      expect(peeked[0]).toBe(actual)
    })

    test('should peek multiple pieces correctly', () => {
      const peeked = randomizer.peekNextPieces(3)
      const actual: PieceType[] = []
      
      for (let i = 0; i < 3; i++) {
        actual.push(randomizer.getNextPiece())
      }
      
      expect(peeked).toEqual(actual)
    })

    test('should peek across bag boundaries', () => {
      // Move to near end of bag
      for (let i = 0; i < 6; i++) {
        randomizer.getNextPiece()
      }

      // Peek 3 pieces (should span across bags)
      const peeked = randomizer.peekNextPieces(3)

      // Now get the actual pieces one by one
      const actual: PieceType[] = []
      for (let i = 0; i < 3; i++) {
        actual.push(randomizer.getNextPiece())
      }

      expect(peeked).toEqual(actual)
    })

    test('should allow deep peeks without consuming pieces', () => {
      const peeked = randomizer.peekNextPieces(10)
      const actual: PieceType[] = []

      for (let i = 0; i < 10; i++) {
        actual.push(randomizer.getNextPiece())
      }

      expect(peeked).toEqual(actual)
      // Ensure next call continues sequence
      const nextFromPeek = randomizer.peekNextPieces(1)[0]
      const nextActual = randomizer.getNextPiece()
      expect(nextFromPeek).toBe(nextActual)
    })
  })

  describe('Progress Tracking', () => {
    test('should track bag progress correctly', () => {
      const initialProgress = randomizer.getBagProgress()
      expect(initialProgress.current).toBe(0)
      expect(initialProgress.total).toBe(7)
      expect(initialProgress.remaining).toHaveLength(7)

      randomizer.getNextPiece()
      
      const afterOneProgress = randomizer.getBagProgress()
      expect(afterOneProgress.current).toBe(1)
      expect(afterOneProgress.remaining).toHaveLength(6)
    })

    test('should reset progress immediately after completing a bag', () => {
      // Complete a full bag
      for (let i = 0; i < 7; i++) {
        randomizer.getNextPiece()
      }

      const progressAfterBag = randomizer.getBagProgress()
      expect(progressAfterBag.current).toBe(0)
      expect(progressAfterBag.remaining).toHaveLength(7)

      // Consume one more piece from the new bag
      randomizer.getNextPiece()
      const progressAfterNextPiece = randomizer.getBagProgress()
      expect(progressAfterNextPiece.current).toBe(1)
      expect(progressAfterNextPiece.remaining).toHaveLength(6)
    })
  })

  describe('Reset Functionality', () => {
    test('should reset to beginning of new bag', () => {
      // Generate some pieces
      randomizer.getNextPiece()
      randomizer.getNextPiece()
      
      randomizer.reset()
      
      const progress = randomizer.getBagProgress()
      expect(progress.current).toBe(0)
      expect(progress.total).toBe(7)
      expect(progress.remaining).toHaveLength(7)
    })
  })
})

describe('Singleton Functions', () => {
  beforeEach(() => {
    resetRandomizer()
  })

  test('getRandomizer should return singleton instance', () => {
    const randomizer1 = getRandomizer()
    const randomizer2 = getRandomizer()
    
    expect(randomizer1).toBe(randomizer2)
  })

  test('getNextPiece should use singleton', () => {
    const piece1 = getNextPiece()
    const piece2 = getRandomizer().getNextPiece()
    
    expect(ALL_PIECE_TYPES).toContain(piece1)
    expect(ALL_PIECE_TYPES).toContain(piece2)
  })

  test('peekNextPieces should work with singleton', () => {
    const peeked = peekNextPieces(2)
    const actual1 = getNextPiece()
    const actual2 = getNextPiece()
    
    expect(peeked).toEqual([actual1, actual2])
  })

  test('resetRandomizer should reset singleton', () => {
    getNextPiece() // Consume one piece
    
    const progressBefore = getRandomizerProgress()
    expect(progressBefore.current).toBe(1)
    
    resetRandomizer()
    
    const progressAfter = getRandomizerProgress()
    expect(progressAfter.current).toBe(0)
  })
})
