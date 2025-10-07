import React, { useMemo } from 'react'
import { useGameStore } from '@/game/gameStore'
import { formatScore, LINES_PER_LEVEL } from '@/core/constants'

const MobileScoreLevelBar: React.FC = () => {
  const scoreState = useGameStore((state) => state.score)

  const linesToNext = useMemo(() => {
    const remainder = scoreState.totalLines % LINES_PER_LEVEL
    return remainder === 0 ? LINES_PER_LEVEL : LINES_PER_LEVEL - remainder
  }, [scoreState.totalLines])

  return (
    <div className="score-level-bar">
      <div className="score-display">
        <div className="score-label">SCORE</div>
        <div className="score-value">{formatScore(scoreState.score)}</div>
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
          <div className="stat-label">NEXT</div>
          <div className="stat-value">{linesToNext}</div>
        </div>
      </div>
    </div>
  )
}

export default MobileScoreLevelBar
