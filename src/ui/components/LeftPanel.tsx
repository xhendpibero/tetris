import React from 'react'
import NextPiecePreview from './NextPiecePreview'
import HoldPieceDisplay from './HoldPieceDisplay'

const LeftPanel: React.FC = () => {
  return (
    <div className="left-panel">
      <NextPiecePreview />
      <HoldPieceDisplay />
    </div>
  )
}

export default LeftPanel
