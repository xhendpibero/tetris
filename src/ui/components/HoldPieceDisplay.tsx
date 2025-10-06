import React from 'react'
import PieceRenderer from './PieceRenderer'

interface HoldPieceDisplayProps {
  holdPiece?: 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L' | null
  canHold?: boolean
}

const HoldPieceDisplay: React.FC<HoldPieceDisplayProps> = ({ 
  holdPiece = null, 
  canHold = true 
}) => {
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
