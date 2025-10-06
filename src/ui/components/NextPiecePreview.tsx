import React from 'react'
import PieceRenderer from './PieceRenderer'

interface NextPiecePreviewProps {
  nextPiece?: 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'
}

const NextPiecePreview: React.FC<NextPiecePreviewProps> = ({ nextPiece = 'T' }) => {
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
