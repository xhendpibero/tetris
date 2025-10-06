import React from 'react'

const ScorePanel: React.FC = () => {
  return (
    <div className="panel">
      <div className="panel-content">
        <div className="score-display">
          <div className="score-label">SCORE</div>
          <div className="score-value">0</div>
        </div>
        
        <div className="level-lines-display">
          <div className="stat-item">
            <div className="stat-label">LEVEL</div>
            <div className="stat-value">1</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">LINES</div>
            <div className="stat-value">0</div>
          </div>
        </div>
        
        <div className="score-display">
          <div className="score-label">HIGH SCORE</div>
          <div className="score-value">0</div>
        </div>
      </div>
    </div>
  )
}

export default ScorePanel
