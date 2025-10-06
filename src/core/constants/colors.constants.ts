// Color palette constants matching CSS variables

// Background colors
export const COLORS = {
  background: '#0A0A0A',
  uiBackground: '#1A1A1A',
  panelBackground: '#2A2A2A',
  borderPrimary: '#3A3A3A',
  
  // Accent colors
  primaryAccent: '#00F0F0',
  success: '#00F000',
  warning: '#F0F000',
  danger: '#F00000',
  info: '#0000F0',
  
  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textDisabled: '#4A4A4A',
  textLabel: '#00F0F0',
  
  // Grid and board
  gridLines: '#2C2C2C',
  boardBackground: '#000000',
  blockBorder: '#FFFFFF',
  
  // Tetromino colors (matching piece constants)
  pieceI: '#00F0F0', // Cyan
  pieceO: '#F0F000', // Yellow
  pieceT: '#A000F0', // Purple
  pieceS: '#00F000', // Green
  pieceZ: '#F00000', // Red
  pieceJ: '#0000F0', // Blue
  pieceL: '#F0A000', // Orange
} as const

// Ghost piece opacity
export const GHOST_PIECE_OPACITY = 0.3

// Color utility functions
export const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const getGhostColor = (pieceColor: string): string => {
  return hexToRgba(pieceColor, GHOST_PIECE_OPACITY)
}
