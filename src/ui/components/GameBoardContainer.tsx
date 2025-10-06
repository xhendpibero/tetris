import React, { useMemo } from 'react'
import GameBoard from './GameBoard'
import { useGameStore } from '@/game/gameStore'
import { BOARD_VISIBLE_HEIGHT } from '@/core/constants'

const GameBoardContainer: React.FC = () => {
  const board = useGameStore((state) => state.board)
  const activePiece = useGameStore((state) => state.activePiece)

  const visibleBoard = useMemo(() => {
    return board?.grid.slice(0, BOARD_VISIBLE_HEIGHT) ?? null
  }, [board])

  return (
    <div className="game-board-container">
      <GameBoard
        board={visibleBoard || undefined}
        currentPiece={activePiece ? {
          shape: activePiece.shape,
          position: activePiece.position,
          color: activePiece.color,
        } : null}
      />
    </div>
  )
}

export default GameBoardContainer
