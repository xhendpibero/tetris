import React from 'react'
import { BOARD_WIDTH, BOARD_VISIBLE_HEIGHT } from '@/core/constants'
import { CellState } from '@/core/types'

interface GameBoardProps {
  board?: CellState[][]
  currentPiece?: {
    shape: boolean[][]
    position: { x: number; y: number }
    color: string
  } | null
  ghostPiece?: {
    shape: boolean[][]
    position: { x: number; y: number }
    color: string
  } | null
  showGrid?: boolean
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  currentPiece,
  ghostPiece,
  showGrid = true
}) => {
  // Initialize empty board if none provided
  const gameBoard = board || Array(BOARD_VISIBLE_HEIGHT).fill(null).map(() =>
    Array(BOARD_WIDTH).fill(null)
  )

  const renderCell = (row: number, col: number) => {
    const cell = gameBoard[row]?.[col]
    let cellContent = null
    let cellClass = 'board-cell'

    // Check if this position has a filled cell
    if (cell?.filled) {
      cellClass += ' filled'
      cellContent = (
        <div 
          className={`piece-block ${cell.pieceType?.toLowerCase() || ''}`}
          style={{ backgroundColor: cell.color || '#FFFFFF' }}
        />
      )
    }

    // Check if current piece occupies this position
    if (currentPiece && !cellContent) {
      const pieceRow = row - currentPiece.position.y
      const pieceCol = col - currentPiece.position.x
      
      if (
        pieceRow >= 0 && 
        pieceRow < currentPiece.shape.length &&
        pieceCol >= 0 && 
        pieceCol < currentPiece.shape[pieceRow].length &&
        currentPiece.shape[pieceRow][pieceCol]
      ) {
        cellClass += ' current-piece'
        cellContent = (
          <div 
            className="piece-block current"
            style={{ backgroundColor: currentPiece.color }}
          />
        )
      }
    }

    // Check if ghost piece occupies this position (only if no other content)
    if (ghostPiece && !cellContent) {
      const ghostRow = row - ghostPiece.position.y
      const ghostCol = col - ghostPiece.position.x
      
      if (
        ghostRow >= 0 && 
        ghostRow < ghostPiece.shape.length &&
        ghostCol >= 0 && 
        ghostCol < ghostPiece.shape[ghostRow].length &&
        ghostPiece.shape[ghostRow][ghostCol]
      ) {
        cellClass += ' ghost-piece'
        cellContent = (
          <div 
            className="piece-block ghost"
            style={{ 
              backgroundColor: ghostPiece.color,
              opacity: 0.3,
              borderStyle: 'dashed'
            }}
          />
        )
      }
    }

    return (
      <div 
        key={`${row}-${col}`}
        className={cellClass}
        data-row={row}
        data-col={col}
      >
        {cellContent}
      </div>
    )
  }

  return (
    <div className={`game-board ${showGrid ? 'show-grid' : ''}`}>
      <div className="board-grid">
        {Array(BOARD_VISIBLE_HEIGHT).fill(null).map((_, row) =>
          Array(BOARD_WIDTH).fill(null).map((_, col) =>
            renderCell(row, col)
          )
        )}
      </div>
      
      {/* Grid lines overlay */}
      {showGrid && (
        <div className="grid-lines">
          {/* Vertical lines */}
          {Array(BOARD_WIDTH + 1).fill(null).map((_, i) => (
            <div 
              key={`v-${i}`}
              className="grid-line vertical"
              style={{ left: `${(i * 100) / BOARD_WIDTH}%` }}
            />
          ))}
          {/* Horizontal lines */}
          {Array(BOARD_VISIBLE_HEIGHT + 1).fill(null).map((_, i) => (
            <div 
              key={`h-${i}`}
              className="grid-line horizontal"
              style={{ top: `${(i * 100) / BOARD_VISIBLE_HEIGHT}%` }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default GameBoard