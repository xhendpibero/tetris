import { ALL_PIECE_TYPES } from '../constants/pieces.constants'
import { PieceType } from '../types/piece.types'

export type RandomNumberGenerator = () => number

const BAG_SIZE = ALL_PIECE_TYPES.length

const createShuffledBag = (rng: RandomNumberGenerator): PieceType[] => {
  const bag = [...ALL_PIECE_TYPES]

  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[bag[i], bag[j]] = [bag[j], bag[i]]
  }

  return bag
}

class SevenBagRandomizer {
  private readonly rng: RandomNumberGenerator
  private bags: PieceType[][] = []
  private pieceIndex = 0

  constructor(rng: RandomNumberGenerator = Math.random) {
    this.rng = rng
    this.reset()
  }

  private ensureBagCount(minCount: number): void {
    while (this.bags.length < minCount) {
      this.bags.push(createShuffledBag(this.rng))
    }
  }

  private advanceBagIfNeeded(): void {
    if (!this.bags.length) {
      this.ensureBagCount(1)
    }

    while (this.pieceIndex >= BAG_SIZE) {
      this.bags.shift()
      this.pieceIndex -= BAG_SIZE

      if (!this.bags.length) {
        this.ensureBagCount(1)
      }
    }

    this.ensureBagCount(2)
  }

  getNextPiece(): PieceType {
    if (!this.bags.length || this.pieceIndex >= BAG_SIZE) {
      this.advanceBagIfNeeded()
    }

    const piece = this.bags[0][this.pieceIndex]
    this.pieceIndex += 1

    if (this.pieceIndex >= BAG_SIZE) {
      this.advanceBagIfNeeded()
    }

    return piece
  }

  peekNextPieces(count: number = 1): PieceType[] {
    if (count <= 0) {
      return []
    }

    if (!this.bags.length || this.pieceIndex >= BAG_SIZE) {
      this.advanceBagIfNeeded()
    }

    const requiredBags = Math.max(2, Math.ceil((this.pieceIndex + count) / BAG_SIZE))
    this.ensureBagCount(requiredBags)

    const pieces: PieceType[] = []
    let bagIdx = 0
    let offset = this.pieceIndex

    for (let i = 0; i < count; i++) {
      const bag = this.bags[bagIdx]
      pieces.push(bag[offset])
      offset += 1

      if (offset >= BAG_SIZE) {
        bagIdx += 1
        offset = 0
      }
    }

    return pieces
  }

  getBagProgress(): { current: number; total: number; remaining: PieceType[] } {
    if (!this.bags.length || this.pieceIndex >= BAG_SIZE) {
      this.advanceBagIfNeeded()
    }

    const currentBag = this.bags[0]

    return {
      current: this.pieceIndex,
      total: BAG_SIZE,
      remaining: currentBag.slice(this.pieceIndex),
    }
  }

  reset(): void {
    this.bags = []
    this.pieceIndex = 0
    this.ensureBagCount(2)
  }
}

let randomizerInstance: SevenBagRandomizer | null = null

export const getRandomizer = (): SevenBagRandomizer => {
  if (!randomizerInstance) {
    randomizerInstance = new SevenBagRandomizer()
  }
  return randomizerInstance
}

export const getNextPiece = (): PieceType => {
  return getRandomizer().getNextPiece()
}

export const peekNextPieces = (count: number = 1): PieceType[] => {
  return getRandomizer().peekNextPieces(count)
}

export const resetRandomizer = (): void => {
  if (randomizerInstance) {
    randomizerInstance.reset()
  }
}

export const getRandomizerProgress = () => {
  return getRandomizer().getBagProgress()
}

export { SevenBagRandomizer }
