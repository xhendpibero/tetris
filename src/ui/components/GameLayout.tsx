import React from 'react'
import LeftPanel from './LeftPanel'
import GameBoardContainer from './GameBoardContainer'
import RightPanel from './RightPanel'
import GameControls from './GameControls'
import MobileScoreLevelBar from './MobileScoreLevelBar'
import MobileNextHoldBar from './MobileNextHoldBar'
import TouchControls from './TouchControls'

const GameLayout: React.FC = () => {
  return (
    <div className="game-layout">
      {/* Mobile-only components */}
      <MobileScoreLevelBar />
      <MobileNextHoldBar />
      
      {/* Desktop/Tablet panels */}
      <LeftPanel />
      <GameBoardContainer />
      <RightPanel />
      
      {/* Game controls */}
      <GameControls />
      
      {/* Mobile touch controls */}
      <TouchControls />
    </div>
  )
}

export default GameLayout
