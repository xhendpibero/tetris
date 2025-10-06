import React from 'react'
import { useGameStore } from '@/game/gameStore'

const GameControls: React.FC = () => {
  const status = useGameStore((state) => state.status)
  const pauseGame = useGameStore((state) => state.pauseGame)
  const resumeGame = useGameStore((state) => state.resumeGame)
  const restartGame = useGameStore((state) => state.restartGame)

  const isPlaying = status === 'playing'
  const isPaused = status === 'paused'
  const isInteractable = status === 'playing' || status === 'paused'

  const handlePauseToggle = () => {
    if (isPlaying) {
      pauseGame()
    } else if (isPaused) {
      resumeGame()
    }
  }

  return (
    <div className="game-controls">
      <button
        className="btn btn-secondary btn-sm"
        onClick={handlePauseToggle}
        disabled={!isInteractable}
      >
        {isPaused ? '▶ RESUME' : '⏸ PAUSE'}
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
