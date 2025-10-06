export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'

export type Rotation = 0 | 1 | 2 | 3

export interface Position {
  x: number
  y: number
}

export interface PieceState {
  type: PieceType
  shape: boolean[][]
  position: Position
  rotation: Rotation
  color: string
}

export interface PieceDefinition {
  type: PieceType
  color: string
  shapes: boolean[][][]
  spawnPosition: Position
}
