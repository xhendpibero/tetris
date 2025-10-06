// Super Rotation System (SRS) wall kick data
// Official Tetris rotation system with wall kick attempts

import { Position } from '../types/piece.types'

// Wall kick offset data for standard pieces (T, S, Z, J, L)
export const SRS_WALL_KICK_DATA: Record<string, Position[]> = {
  // 0 -> R (0 to 90 degrees clockwise)
  '0->1': [
    { x: 0, y: 0 },   // No offset (try original position)
    { x: -1, y: 0 },  // Try 1 left
    { x: -1, y: 1 },  // Try 1 left, 1 up
    { x: 0, y: -2 },  // Try 2 down
    { x: -1, y: -2 }, // Try 1 left, 2 down
  ],
  
  // R -> 2 (90 to 180 degrees clockwise)
  '1->2': [
    { x: 0, y: 0 },   // No offset
    { x: 1, y: 0 },   // Try 1 right
    { x: 1, y: -1 },  // Try 1 right, 1 down
    { x: 0, y: 2 },   // Try 2 up
    { x: 1, y: 2 },   // Try 1 right, 2 up
  ],
  
  // 2 -> L (180 to 270 degrees clockwise)
  '2->3': [
    { x: 0, y: 0 },   // No offset
    { x: 1, y: 0 },   // Try 1 right
    { x: 1, y: 1 },   // Try 1 right, 1 up
    { x: 0, y: -2 },  // Try 2 down
    { x: 1, y: -2 },  // Try 1 right, 2 down
  ],
  
  // L -> 0 (270 to 0 degrees clockwise)
  '3->0': [
    { x: 0, y: 0 },   // No offset
    { x: -1, y: 0 },  // Try 1 left
    { x: -1, y: -1 }, // Try 1 left, 1 down
    { x: 0, y: 2 },   // Try 2 up
    { x: -1, y: 2 },  // Try 1 left, 2 up
  ],
  
  // Counter-clockwise rotations (reverse of clockwise)
  '1->0': [
    { x: 0, y: 0 },   // No offset
    { x: 1, y: 0 },   // Try 1 right
    { x: 1, y: -1 },  // Try 1 right, 1 down
    { x: 0, y: 2 },   // Try 2 up
    { x: 1, y: 2 },   // Try 1 right, 2 up
  ],
  
  '2->1': [
    { x: 0, y: 0 },   // No offset
    { x: -1, y: 0 },  // Try 1 left
    { x: -1, y: 1 },  // Try 1 left, 1 up
    { x: 0, y: -2 },  // Try 2 down
    { x: -1, y: -2 }, // Try 1 left, 2 down
  ],
  
  '3->2': [
    { x: 0, y: 0 },   // No offset
    { x: -1, y: 0 },  // Try 1 left
    { x: -1, y: -1 }, // Try 1 left, 1 down
    { x: 0, y: 2 },   // Try 2 up
    { x: -1, y: 2 },  // Try 1 left, 2 up
  ],
  
  '0->3': [
    { x: 0, y: 0 },   // No offset
    { x: 1, y: 0 },   // Try 1 right
    { x: 1, y: 1 },   // Try 1 right, 1 up
    { x: 0, y: -2 },  // Try 2 down
    { x: 1, y: -2 },  // Try 1 right, 2 down
  ],
}

// Special wall kick data for I-piece (uses different grid system)
export const SRS_I_PIECE_WALL_KICK_DATA: Record<string, Position[]> = {
  // I-piece clockwise rotations
  '0->1': [
    { x: 0, y: 0 },   // No offset
    { x: -2, y: 0 },  // Try 2 left
    { x: 1, y: 0 },   // Try 1 right
    { x: -2, y: -1 }, // Try 2 left, 1 down
    { x: 1, y: 2 },   // Try 1 right, 2 up
  ],
  
  '1->2': [
    { x: 0, y: 0 },   // No offset
    { x: -1, y: 0 },  // Try 1 left
    { x: 2, y: 0 },   // Try 2 right
    { x: -1, y: 2 },  // Try 1 left, 2 up
    { x: 2, y: -1 },  // Try 2 right, 1 down
  ],
  
  '2->3': [
    { x: 0, y: 0 },   // No offset
    { x: 2, y: 0 },   // Try 2 right
    { x: -1, y: 0 },  // Try 1 left
    { x: 2, y: 1 },   // Try 2 right, 1 up
    { x: -1, y: -2 }, // Try 1 left, 2 down
  ],
  
  '3->0': [
    { x: 0, y: 0 },   // No offset
    { x: 1, y: 0 },   // Try 1 right
    { x: -2, y: 0 },  // Try 2 left
    { x: 1, y: -2 },  // Try 1 right, 2 down
    { x: -2, y: 1 },  // Try 2 left, 1 up
  ],
  
  // I-piece counter-clockwise rotations
  '1->0': [
    { x: 0, y: 0 },   // No offset
    { x: 2, y: 0 },   // Try 2 right
    { x: -1, y: 0 },  // Try 1 left
    { x: 2, y: 1 },   // Try 2 right, 1 up
    { x: -1, y: -2 }, // Try 1 left, 2 down
  ],
  
  '2->1': [
    { x: 0, y: 0 },   // No offset
    { x: 1, y: 0 },   // Try 1 right
    { x: -2, y: 0 },  // Try 2 left
    { x: 1, y: -2 },  // Try 1 right, 2 down
    { x: -2, y: 1 },  // Try 2 left, 1 up
  ],
  
  '3->2': [
    { x: 0, y: 0 },   // No offset
    { x: -2, y: 0 },  // Try 2 left
    { x: 1, y: 0 },   // Try 1 right
    { x: -2, y: -1 }, // Try 2 left, 1 down
    { x: 1, y: 2 },   // Try 1 right, 2 up
  ],
  
  '0->3': [
    { x: 0, y: 0 },   // No offset
    { x: -1, y: 0 },  // Try 1 left
    { x: 2, y: 0 },   // Try 2 right
    { x: -1, y: 2 },  // Try 1 left, 2 up
    { x: 2, y: -1 },  // Try 2 right, 1 down
  ],
}

// Helper function to get wall kick data for a piece type and rotation
export const getWallKickData = (
  pieceType: string,
  fromRotation: number,
  toRotation: number
): Position[] => {
  const key = `${fromRotation}->${toRotation}`
  
  if (pieceType === 'I') {
    return SRS_I_PIECE_WALL_KICK_DATA[key] || []
  } else if (pieceType === 'O') {
    // O-piece doesn't rotate, return empty array
    return []
  } else {
    // Standard pieces (T, S, Z, J, L)
    return SRS_WALL_KICK_DATA[key] || []
  }
}

// Helper function to get next rotation state
export const getNextRotation = (currentRotation: number, clockwise: boolean = true): number => {
  if (clockwise) {
    return (currentRotation + 1) % 4
  } else {
    return (currentRotation + 3) % 4 // Same as -1 but always positive
  }
}
