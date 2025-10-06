import React from 'react'
import PieceRenderer from './PieceRenderer'
import { useGameStore } from '@/game/gameStore'

const HoldPieceDisplay: React.FC = () => {
  const holdPiece = useGameStore((state) => state.holdPiece)
  const canHold = useGameStore((state) => state.canHold)

  return (
    <div className="panel">
      <div className="panel-title">HOLD</div>
      <div className="panel-content">
        <div className={`piece-preview hold ${!canHold ? 'disabled' : ''}`}>
          {holdPiece ? (
            <PieceRenderer 
              pieceType={holdPiece} 
              scale={0.8}
              className="preview-piece"
            />
          ) : (
            <div className="preview-placeholder">
              <div className="placeholder-text">Hold</div>
              <div className="placeholder-subtext">Piece</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HoldPieceDisplay
