import React from 'react'

const TouchControls: React.FC = () => {
  return (
    <div className="touch-controls">
      <div className="touch-controls-container">
        {/* Left movement button */}
        <div className="touch-control-left">
          <button className="btn-touch">
            ←
          </button>
        </div>
        
        {/* Center controls (rotate and hold) */}
        <div className="touch-control-center">
          <button className="btn-touch">
            ↻
          </button>
          <button className="btn-touch">
            HOLD
          </button>
        </div>
        
        {/* Right movement button */}
        <div className="touch-control-right">
          <button className="btn-touch">
            →
          </button>
        </div>
        
        {/* Bottom soft drop button */}
        <div className="touch-control-bottom">
          <button className="soft-drop-button">
            ↓ SOFT DROP
          </button>
        </div>
      </div>
    </div>
  )
}

export default TouchControls
