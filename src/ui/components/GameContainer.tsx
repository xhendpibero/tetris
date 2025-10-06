import React from 'react'
import GameLayout from './GameLayout'
import GameTitle from './GameTitle'

const GameContainer: React.FC = () => {
  return (
    <div className="game-container">
      <GameTitle />
      <GameLayout />
    </div>
  )
}

export default GameContainer
