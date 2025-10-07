import React, { useMemo } from 'react'
import { useGameStore } from '@/game/gameStore'
import { formatScore, LINES_PER_LEVEL } from '@/core/constants'

const ScorePanel: React.FC = () => {
  const scoreState = useGameStore((state) => state.score)
  const startingLevel = useGameStore((state) => state.startingLevel)

  const formattedScore = formatScore(scoreState.score)
  const formattedHighScore = formatScore(scoreState.highScore)

  const linesToNext = useMemo(() => {
    const totalLines = scoreState.totalLines
    const remainder = totalLines % LINES_PER_LEVEL
    return remainder === 0 ? LINES_PER_LEVEL : LINES_PER_LEVEL - remainder
  }, [scoreState.totalLines])

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
          <div className="stat-item">
            <div className="stat-label">NEXT LVL</div>
            <div className="stat-value">{linesToNext}</div>
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
