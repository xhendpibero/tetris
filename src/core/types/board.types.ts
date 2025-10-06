export type CellState = {
  filled: boolean
  color: string | null
  pieceType: PieceType | null
} | null

export interface BoardState {
  grid: CellState[][]
  width: number
  height: number
  visibleHeight: number
}

export interface BoardDimensions {
  width: number
  height: number
  visibleHeight: number
  blockSize: number
}

export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'
