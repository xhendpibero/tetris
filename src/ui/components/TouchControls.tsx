import React from 'react'
import { useGameStore } from '@/game/gameStore'

const TouchControls: React.FC = () => {
  const status = useGameStore((state) => state.status)
  const moveLeft = useGameStore((state) => state.moveLeft)
  const moveRight = useGameStore((state) => state.moveRight)
  const rotate = useGameStore((state) => state.rotateClockwise)
  const hold = useGameStore((state) => state.holdCurrentPiece)
  const softDrop = useGameStore((state) => state.softDrop)
  const hardDrop = useGameStore((state) => state.hardDrop)

  const isActive = status === 'playing' || status === 'lineClearing'

  return (
    <div className="touch-controls">
      <div className="touch-controls-container">
        <div className="touch-control-left">
          <button className="btn-touch" onPointerDown={moveLeft} disabled={!isActive}>
            ←
          </button>
        </div>

        <div className="touch-control-center">
          <button className="btn-touch" onPointerDown={rotate} disabled={!isActive}>
            ↻
          </button>
          <button className="btn-touch" onPointerDown={hold} disabled={!isActive}>
            HOLD
          </button>
          <button className="btn-touch" onPointerDown={hardDrop} disabled={!isActive}>
            ⬇ HARD
          </button>
        </div>

        <div className="touch-control-right">
          <button className="btn-touch" onPointerDown={moveRight} disabled={!isActive}>
            →
          </button>
        </div>

        <div className="touch-control-bottom">
          <button className="soft-drop-button" onPointerDown={softDrop} disabled={!isActive}>
            ↓ SOFT DROP
          </button>
        </div>
      </div>
    </div>
  )
}

export default TouchControls
