import React from 'react'
import { PIECE_DEFINITIONS } from '@/core/constants'
import { PieceType } from '@/core/types'

interface PieceRendererProps {
  pieceType: PieceType
  rotation?: number
  scale?: number
  className?: string
}

const PieceRenderer: React.FC<PieceRendererProps> = ({
  pieceType,
  rotation = 0,
  scale = 1,
  className = ''
}) => {
  const pieceDefinition = PIECE_DEFINITIONS[pieceType]
  const shape = pieceDefinition.shapes[rotation]
  const color = pieceDefinition.color

  const blockSize = 20 * scale // Base block size scaled

  return (
    <div className={`piece-renderer ${className}`}>
      <div 
        className="piece-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${shape[0].length}, ${blockSize}px)`,
          gridTemplateRows: `repeat(${shape.length}, ${blockSize}px)`,
          gap: '1px',
        }}
      >
        {shape.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`piece-cell ${cell ? 'filled' : 'empty'}`}
              style={{
                width: `${blockSize}px`,
                height: `${blockSize}px`,
                backgroundColor: cell ? color : 'transparent',
                border: cell ? '1px solid #FFFFFF' : 'none',
                borderRadius: '0px',
                boxShadow: cell ? 
                  'inset 1px 1px 2px rgba(255, 255, 255, 0.3), inset -1px -1px 2px rgba(0, 0, 0, 0.3)' : 
                  'none',
              }}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default PieceRenderer
