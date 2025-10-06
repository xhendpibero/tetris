import React from 'react'
import { useGameStore } from '@/game/gameStore'
import { formatScore } from '@/core/constants'

const ScorePanel: React.FC = () => {
  const scoreState = useGameStore((state) => state.score)

  const formattedScore = formatScore(scoreState.score)
  const formattedHighScore = formatScore(scoreState.highScore)

  return (
    <div className="panel">
      <div className="panel-content">
        <div className="score-display">
          <div className="score-label">SCORE</div>
          <div className="score-value">{formattedScore}</div>
        </div>
        
        <div className="level-lines-display">
          <div className="stat-item">
            <div className="stat-label">LEVEL</div>
            <div className="stat-value">{scoreState.level}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">LINES</div>
            <div className="stat-value">{scoreState.totalLines}</div>
          </div>
        </div>
        
        <div className="score-display">
          <div className="score-label">HIGH SCORE</div>
          <div className="score-value">{formattedHighScore}</div>
        </div>
      </div>
    </div>
  )
}

export default ScorePanel
