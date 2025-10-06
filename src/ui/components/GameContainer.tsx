import React, { useEffect } from 'react'
import GameLayout from './GameLayout'
import GameTitle from './GameTitle'
import { useGameStore } from '@/game/gameStore'
import { InputManager } from '@/game/InputManager'

const GameContainer: React.FC = () => {
  const status = useGameStore((state) => state.status)
  const startGame = useGameStore((state) => state.startGame)
  const tick = useGameStore((state) => state.tick)
  const resumeGame = useGameStore((state) => state.resumeGame)
  const restartGame = useGameStore((state) => state.restartGame)
  const storeRef = useGameStore

  useEffect(() => {
    startGame()
  }, [startGame])

  useEffect(() => {
    const manager = new InputManager(storeRef)
    manager.attach()

    return () => {
      manager.detach()
    }
  }, [storeRef])

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
            <p>Press Start to begin your game.</p>
          </div>
        </div>
      )
    }

    if (status === 'paused') {
      return (
        <div className="game-overlay">
          <div className="overlay-content">
            <h2>Paused</h2>
            <button className="btn btn-primary" onClick={resumeGame}>
              ▶ Resume
            </button>
          </div>
        </div>
      )
    }

    if (status === 'gameOver') {
      return (
        <div className="game-overlay">
          <div className="overlay-content">
            <h2>Game Over</h2>
            <button className="btn btn-primary" onClick={restartGame}>
              ↻ Restart
            </button>
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
