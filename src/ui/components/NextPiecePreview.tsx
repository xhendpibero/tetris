import React from 'react'
import PieceRenderer from './PieceRenderer'
import { useGameStore } from '@/game/gameStore'

const NextPiecePreview: React.FC = () => {
  const nextPiece = useGameStore((state) => state.nextQueue[0] ?? null)

  return (
    <div className="panel">
      <div className="panel-title">NEXT</div>
      <div className="panel-content">
        <div className="piece-preview next">
          {nextPiece ? (
            <PieceRenderer 
              pieceType={nextPiece} 
              scale={0.8}
              className="preview-piece"
            />
          ) : (
            <div className="preview-placeholder">
              <div className="placeholder-text">Next</div>
              <div className="placeholder-subtext">Piece</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NextPiecePreview
