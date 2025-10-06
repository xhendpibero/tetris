// Scoring system constants based on official Tetris guidelines

// Base points for line clears (multiplied by level)
export const LINE_CLEAR_POINTS = {
  single: 100,   // 1 line
  double: 300,   // 2 lines
  triple: 500,   // 3 lines
  tetris: 800,   // 4 lines
} as const

// Back-to-back Tetris bonus multiplier
export const BACK_TO_BACK_MULTIPLIER = 1.5

// Combo system
export const COMBO_BASE_POINTS = 50 // Base points per combo level

// Drop bonuses
export const SOFT_DROP_POINTS = 1 // Points per cell soft dropped
export const HARD_DROP_POINTS = 2 // Points per cell hard dropped

// Level progression
export const LINES_PER_LEVEL = 10 // Lines needed to advance each level
export const MAX_STARTING_LEVEL = 15 // Maximum selectable starting level

// Score formatting
export const MAX_SCORE_DISPLAY = 999999999 // Display "MAX" beyond this
export const SCORE_DISPLAY_TEXT = 'MAX'

// Statistics tracking
export const STATS_STORAGE_KEY = 'tetris_statistics'
export const HIGH_SCORE_STORAGE_KEY = 'tetris_high_score'
export const SETTINGS_STORAGE_KEY = 'tetris_settings'

// Scoring calculation functions
export const calculateLineClearScore = (
  linesCleared: number,
  level: number,
  isBackToBack: boolean = false
): number => {
  let basePoints = 0
  
  switch (linesCleared) {
    case 1:
      basePoints = LINE_CLEAR_POINTS.single
      break
    case 2:
      basePoints = LINE_CLEAR_POINTS.double
      break
    case 3:
      basePoints = LINE_CLEAR_POINTS.triple
      break
    case 4:
      basePoints = LINE_CLEAR_POINTS.tetris
      if (isBackToBack) {
        basePoints = Math.floor(basePoints * BACK_TO_BACK_MULTIPLIER)
      }
      break
    default:
      return 0
  }
  
  return basePoints * level
}

export const calculateComboScore = (
  comboCount: number,
  level: number
): number => {
  return COMBO_BASE_POINTS * comboCount * level
}

export const calculateDropScore = (
  cellsDropped: number,
  isHardDrop: boolean
): number => {
  const pointsPerCell = isHardDrop ? HARD_DROP_POINTS : SOFT_DROP_POINTS
  return cellsDropped * pointsPerCell
}

export const calculateLevel = (totalLines: number, startingLevel: number = 1): number => {
  return startingLevel + Math.floor(totalLines / LINES_PER_LEVEL)
}

export const formatScore = (score: number): string => {
  if (score > MAX_SCORE_DISPLAY) {
    return SCORE_DISPLAY_TEXT
  }
  return score.toLocaleString()
}
