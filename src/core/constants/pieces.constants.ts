import { PieceType, PieceDefinition } from '../types/piece.types'

// Tetromino colors (RGB values as per design specification)
export const PIECE_COLORS: Record<PieceType, string> = {
  I: '#00F0F0', // Cyan
  O: '#F0F000', // Yellow
  T: '#A000F0', // Purple
  S: '#00F000', // Green
  Z: '#F00000', // Red
  J: '#0000F0', // Blue
  L: '#F0A000', // Orange
}

// I-Piece (Cyan) - 4x4 grid, horizontal/vertical orientations
const I_SHAPES: boolean[][][] = [
  // Rotation 0: Horizontal
  [
    [false, false, false, false],
    [true,  true,  true,  true ],
    [false, false, false, false],
    [false, false, false, false],
  ],
  // Rotation 1: Vertical
  [
    [false, false, true,  false],
    [false, false, true,  false],
    [false, false, true,  false],
    [false, false, true,  false],
  ],
  // Rotation 2: Horizontal
  [
    [false, false, false, false],
    [false, false, false, false],
    [true,  true,  true,  true ],
    [false, false, false, false],
  ],
  // Rotation 3: Vertical
  [
    [false, true,  false, false],
    [false, true,  false, false],
    [false, true,  false, false],
    [false, true,  false, false],
  ],
]

// O-Piece (Yellow) - 2x2 square, no rotation
const O_SHAPES: boolean[][][] = [
  // All rotations are the same
  [
    [true,  true ],
    [true,  true ],
  ],
  [
    [true,  true ],
    [true,  true ],
  ],
  [
    [true,  true ],
    [true,  true ],
  ],
  [
    [true,  true ],
    [true,  true ],
  ],
]

// T-Piece (Purple) - T-shaped piece
const T_SHAPES: boolean[][][] = [
  // Rotation 0: T pointing up
  [
    [false, true,  false],
    [true,  true,  true ],
    [false, false, false],
  ],
  // Rotation 1: T pointing right
  [
    [false, true,  false],
    [false, true,  true ],
    [false, true,  false],
  ],
  // Rotation 2: T pointing down
  [
    [false, false, false],
    [true,  true,  true ],
    [false, true,  false],
  ],
  // Rotation 3: T pointing left
  [
    [false, true,  false],
    [true,  true,  false],
    [false, true,  false],
  ],
]

// S-Piece (Green) - S-shaped piece
const S_SHAPES: boolean[][][] = [
  // Rotation 0: Horizontal S
  [
    [false, true,  true ],
    [true,  true,  false],
    [false, false, false],
  ],
  // Rotation 1: Vertical S
  [
    [false, true,  false],
    [false, true,  true ],
    [false, false, true ],
  ],
  // Rotation 2: Horizontal S
  [
    [false, false, false],
    [false, true,  true ],
    [true,  true,  false],
  ],
  // Rotation 3: Vertical S
  [
    [true,  false, false],
    [true,  true,  false],
    [false, true,  false],
  ],
]

// Z-Piece (Red) - Z-shaped piece
const Z_SHAPES: boolean[][][] = [
  // Rotation 0: Horizontal Z
  [
    [true,  true,  false],
    [false, true,  true ],
    [false, false, false],
  ],
  // Rotation 1: Vertical Z
  [
    [false, false, true ],
    [false, true,  true ],
    [false, true,  false],
  ],
  // Rotation 2: Horizontal Z
  [
    [false, false, false],
    [true,  true,  false],
    [false, true,  true ],
  ],
  // Rotation 3: Vertical Z
  [
    [false, true,  false],
    [true,  true,  false],
    [true,  false, false],
  ],
]

// J-Piece (Blue) - J-shaped piece
const J_SHAPES: boolean[][][] = [
  // Rotation 0: J pointing up
  [
    [true,  false, false],
    [true,  true,  true ],
    [false, false, false],
  ],
  // Rotation 1: J pointing right
  [
    [false, true,  true ],
    [false, true,  false],
    [false, true,  false],
  ],
  // Rotation 2: J pointing down
  [
    [false, false, false],
    [true,  true,  true ],
    [false, false, true ],
  ],
  // Rotation 3: J pointing left
  [
    [false, true,  false],
    [false, true,  false],
    [true,  true,  false],
  ],
]

// L-Piece (Orange) - L-shaped piece
const L_SHAPES: boolean[][][] = [
  // Rotation 0: L pointing up
  [
    [false, false, true ],
    [true,  true,  true ],
    [false, false, false],
  ],
  // Rotation 1: L pointing right
  [
    [false, true,  false],
    [false, true,  false],
    [false, true,  true ],
  ],
  // Rotation 2: L pointing down
  [
    [false, false, false],
    [true,  true,  true ],
    [true,  false, false],
  ],
  // Rotation 3: L pointing left
  [
    [true,  true,  false],
    [false, true,  false],
    [false, true,  false],
  ],
]

// Complete piece definitions
export const PIECE_DEFINITIONS: Record<PieceType, PieceDefinition> = {
  I: {
    type: 'I',
    color: PIECE_COLORS.I,
    shapes: I_SHAPES,
    spawnPosition: { x: 3, y: 0 }, // Centered in spawn zone
  },
  O: {
    type: 'O',
    color: PIECE_COLORS.O,
    shapes: O_SHAPES,
    spawnPosition: { x: 4, y: 0 }, // Centered
  },
  T: {
    type: 'T',
    color: PIECE_COLORS.T,
    shapes: T_SHAPES,
    spawnPosition: { x: 3, y: 0 }, // Centered
  },
  S: {
    type: 'S',
    color: PIECE_COLORS.S,
    shapes: S_SHAPES,
    spawnPosition: { x: 3, y: 0 }, // Centered
  },
  Z: {
    type: 'Z',
    color: PIECE_COLORS.Z,
    shapes: Z_SHAPES,
    spawnPosition: { x: 3, y: 0 }, // Centered
  },
  J: {
    type: 'J',
    color: PIECE_COLORS.J,
    shapes: J_SHAPES,
    spawnPosition: { x: 3, y: 0 }, // Centered
  },
  L: {
    type: 'L',
    color: PIECE_COLORS.L,
    shapes: L_SHAPES,
    spawnPosition: { x: 3, y: 0 }, // Centered
  },
}

// Array of all piece types for randomization
export const ALL_PIECE_TYPES: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L']
