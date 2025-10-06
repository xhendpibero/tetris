// Board specifications
export const BOARD_WIDTH = 10
export const BOARD_HEIGHT = 22 // Total height including hidden rows
export const BOARD_VISIBLE_HEIGHT = 20 // Visible game area
export const BOARD_HIDDEN_ROWS = 2 // Spawn area above visible

// Block sizes for different screen sizes (in pixels)
export const BLOCK_SIZES = {
  desktop: 32,
  tablet: 28,
  mobile: 24,
} as const

// Responsive breakpoints (in pixels)
export const BREAKPOINTS = {
  mobile: 767,
  tablet: 1023,
  desktop: 1024,
  largeDesktop: 1440,
} as const

// Gravity and timing constants
export const GRAVITY_BASE_SPEED = 1000 // Base fall speed in milliseconds (Level 1)
export const GRAVITY_SPEED_DECREASE = 100 // Speed decrease per level
export const GRAVITY_MIN_SPEED = 100 // Minimum fall speed (max speed)
export const GRAVITY_MAX_LEVEL = 10 // Level where max speed is reached

// Lock delay system
export const LOCK_DELAY = 500 // Lock delay in milliseconds
export const LOCK_DELAY_MAX_RESETS = 15 // Maximum lock delay resets per piece

// Soft and hard drop speeds
export const SOFT_DROP_MULTIPLIER = 10 // 10x faster than current gravity
export const SOFT_DROP_MIN_SPEED = 10 // Minimum soft drop speed

// DAS (Delayed Auto Shift) and ARR (Auto Repeat Rate) defaults
export const DAS_DEFAULT = 170 // Initial delay before auto-repeat
export const ARR_DEFAULT = 70 // Auto-repeat rate
export const DAS_MIN = 50
export const DAS_MAX = 250
export const ARR_MIN = 0
export const ARR_MAX = 100

// Animation durations
export const ANIMATION_DURATIONS = {
  lineClearFlash: 150,
  lineClearRemove: 150,
  lineClearTotal: 300,
  pieceLand: 200,
  levelUp: 1000,
  comboPopup: 2000,
  tetrisCelebration: 1500,
  gameOverSlide: 800,
  pauseMenuFade: 300,
} as const

// Game loop timing
export const TARGET_FPS = 60
export const FRAME_TIME = 1000 / TARGET_FPS // ~16.67ms per frame

// Pause buffer to prevent accidental inputs
export const PAUSE_INPUT_BUFFER = 300 // milliseconds

// Touch control settings
export const TOUCH_SETTINGS = {
  swipeThreshold: 50, // Minimum swipe distance in pixels
  swipeMaxDuration: 150, // Maximum duration for fast swipes
  tapThreshold: 100, // Maximum tap duration
  tapMovementThreshold: 10, // Maximum movement for tap detection
  deadZone: 20, // Edge buffer to prevent accidental inputs
} as const

// Game calculation helpers
export const calculateGravitySpeed = (level: number): number => {
  return Math.max(
    GRAVITY_MIN_SPEED,
    GRAVITY_BASE_SPEED - (level - 1) * GRAVITY_SPEED_DECREASE
  )
}

export const calculateSoftDropSpeed = (currentGravity: number): number => {
  return Math.max(SOFT_DROP_MIN_SPEED, currentGravity / SOFT_DROP_MULTIPLIER)
}

export const calculateBlockSize = (screenWidth: number): number => {
  if (screenWidth <= BREAKPOINTS.mobile) {
    return BLOCK_SIZES.mobile
  } else if (screenWidth <= BREAKPOINTS.tablet) {
    return BLOCK_SIZES.tablet
  } else {
    return BLOCK_SIZES.desktop
  }
}
