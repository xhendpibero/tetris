import React, { useEffect } from 'react'
import GameLayout from './GameLayout'
import GameTitle from './GameTitle'
import { useGameStore } from '@/game/gameStore'
import { InputManager } from '@/game/InputManager'

const GameContainer: React.FC = () => {
  const status = useGameStore((state) => state.status)
  const initializeGame = useGameStore((state) => state.initializeGame)
  const beginGame = useGameStore((state) => state.beginGame)
  const tick = useGameStore((state) => state.tick)
  const resumeGame = useGameStore((state) => state.resumeGame)
  const restartGame = useGameStore((state) => state.restartGame)
  const score = useGameStore((state) => state.score)
  const storeRef = useGameStore

  useEffect(() => {
    initializeGame()
    const manager = new InputManager(storeRef)
    manager.attach()

    return () => {
      manager.detach()
    }
  }, [initializeGame, storeRef])

  useEffect(() => {
    let frameId: number
    let lastTimestamp: number | null = null

    const loop = (timestamp: number) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp
      }

      const delta = timestamp - lastTimestamp
      lastTimestamp = timestamp

      if (status === 'playing' || status === 'lineClearing') {
        tick(delta)
      }

      frameId = requestAnimationFrame(loop)
    }

    frameId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [status, tick])

  const renderOverlay = () => {
    if (status === 'menu') {
      return (
        <div className="game-overlay">
          <div className="overlay-content">
            <h2>Ready?</h2>
            <p>Use keyboard or touch controls to play.</p>
            <ul className="overlay-hints">
              <li>← → move</li>
              <li>↑ / X rotate, Z rotate counter</li>
              <li>↓ soft drop, Space hard drop, C hold</li>
            </ul>
            <button className="btn btn-primary" onClick={beginGame}>
              ▶ Start
            </button>
          </div>
        </div>
      )
    }

    if (status === 'paused') {
      return (
        <div className="game-overlay">
          <div className="overlay-content">
            <h2>Paused</h2>
            <div className="overlay-actions">
              <button className="btn btn-primary" onClick={resumeGame}>
                ▶ Resume
              </button>
              <button className="btn btn-secondary" onClick={restartGame}>
                ↻ Restart
              </button>
            </div>
            <p className="overlay-subtext">Press Esc to resume quickly.</p>
          </div>
        </div>
      )
    }

    if (status === 'gameOver') {
      return (
        <div className="game-overlay">
          <div className="overlay-content">
            <h2>Game Over</h2>
            <div className="overlay-stats">
              <div className="overlay-stat"><span>Score</span><strong>{score.score.toLocaleString()}</strong></div>
              <div className="overlay-stat"><span>Lines</span><strong>{score.totalLines}</strong></div>
              <div className="overlay-stat"><span>Level</span><strong>{score.level}</strong></div>
            </div>
            <button className="btn btn-primary" onClick={restartGame}>
              ↻ Restart
            </button>
            <p className="overlay-subtext">Press Enter or Space to restart quickly.</p>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="game-container">
      <GameTitle />
      <GameLayout />
      {renderOverlay()}
    </div>
  )
}

export default GameContainer
