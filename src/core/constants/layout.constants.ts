// Layout dimensions and responsive design constants

// Container and panel dimensions (desktop)
export const LAYOUT_DESKTOP = {
  containerMaxWidth: 1200,
  leftPanelWidth: 200,
  rightPanelWidth: 240,
  panelGap: 20,
  topMargin: 40,
  bottomControlsHeight: 80,
} as const

// Tablet layout adjustments
export const LAYOUT_TABLET = {
  leftPanelWidth: 150,
  rightPanelWidth: 180,
  panelGap: 16,
  topMargin: 20,
} as const

// Mobile layout specifications
export const LAYOUT_MOBILE = {
  panelGap: 12,
  scoreLevelBarHeight: 60,
  nextHoldBarHeight: 80,
  touchControlsHeight: 200,
  buttonSize: 48, // Touch-friendly button size
} as const

// Font size scales for different screen sizes
export const FONT_SIZES = {
  desktop: {
    title: 48,
    scoreLabel: 24,
    scoreValue: 32,
    levelLines: 20,
    button: 18,
    gameOver: 56,
    menu: 16,
  },
  tablet: {
    title: 32,
    scoreLabel: 18,
    scoreValue: 24,
    levelLines: 16,
    button: 16,
    gameOver: 40,
    menu: 14,
  },
  mobile: {
    title: 24,
    scoreLabel: 16,
    scoreValue: 20,
    levelLines: 14,
    button: 14,
    gameOver: 32,
    menu: 12,
  },
} as const

// Board dimensions calculator
export const calculateBoardDimensions = (screenWidth: number) => {
  const blockSize = calculateBlockSize(screenWidth)
  const boardWidth = BOARD_WIDTH * blockSize
  const boardHeight = BOARD_VISIBLE_HEIGHT * blockSize
  
  return {
    boardWidth,
    boardHeight,
    blockSize,
  }
}

// Responsive utilities
export const getLayoutType = (screenWidth: number): 'mobile' | 'tablet' | 'desktop' => {
  if (screenWidth <= BREAKPOINTS.mobile) return 'mobile'
  if (screenWidth <= BREAKPOINTS.tablet) return 'tablet'
  return 'desktop'
}

export const getFontSizes = (screenWidth: number) => {
  const layoutType = getLayoutType(screenWidth)
  return FONT_SIZES[layoutType]
}

// Import from game.constants.ts
import { BREAKPOINTS, BOARD_WIDTH, BOARD_VISIBLE_HEIGHT, calculateBlockSize } from './game.constants'
