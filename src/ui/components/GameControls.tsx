import React from 'react'
import { useGameStore } from '@/game/gameStore'

const GameControls: React.FC = () => {
  const status = useGameStore((state) => state.status)
  const pauseGame = useGameStore((state) => state.pauseGame)
  const restartGame = useGameStore((state) => state.restartGame)

  const isPlaying = status === 'playing'

  if (!isPlaying) {
    return null
  }

  const handlePauseToggle = () => {
    pauseGame()
  }

  return (
    <div className="game-controls">
      <button
        className="btn btn-secondary btn-sm"
        onClick={handlePauseToggle}
      >
        ⏸ PAUSE
      </button>
      <button
        className="btn btn-secondary btn-sm"
        onClick={restartGame}
      >
        ↻ RESTART
      </button>
      <button className="btn btn-secondary btn-sm" disabled>
        ⚙ SETTINGS
      </button>
    </div>
  )
}

export default GameControls
