import React from 'react'
import PieceRenderer from './PieceRenderer'
import { useGameStore } from '@/game/gameStore'

const MobileNextHoldBar: React.FC = () => {
  const nextPiece = useGameStore((state) => state.nextQueue[0] ?? null)
  const holdPiece = useGameStore((state) => state.holdPiece)
  const canHold = useGameStore((state) => state.canHold)

  return (
    <div className="next-hold-bar">
      <div className="mobile-preview-section">
        <div className="panel-title">NEXT</div>
        <div className="piece-preview next">
          {nextPiece ? (
            <PieceRenderer pieceType={nextPiece} scale={0.6} className="preview-piece" />
          ) : (
            <div className="preview-placeholder">
              <div className="placeholder-text">Next</div>
            </div>
          )}
        </div>
      </div>
      <div className="mobile-preview-section">
        <div className="panel-title">HOLD</div>
        <div className={`piece-preview hold ${!canHold ? 'disabled' : ''}`}>
          {holdPiece ? (
            <PieceRenderer pieceType={holdPiece} scale={0.6} className="preview-piece" />
          ) : (
            <div className="preview-placeholder">
              <div className="placeholder-text">Hold</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MobileNextHoldBar
