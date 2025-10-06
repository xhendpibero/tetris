import React from 'react'

const GameControls: React.FC = () => {
  return (
    <div className="game-controls">
      <button className="btn btn-secondary btn-sm">
        ⏸ PAUSE
      </button>
      <button className="btn btn-secondary btn-sm">
        ↻ RESTART
      </button>
      <button className="btn btn-secondary btn-sm">
        ⚙ SETTINGS
      </button>
    </div>
  )
}

export default GameControls
