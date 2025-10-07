import React, { useMemo } from 'react'
import GameBoard from './GameBoard'
import { useGameStore } from '@/game/gameStore'
import { BOARD_VISIBLE_HEIGHT } from '@/core/constants'
import { isValidPosition } from '@/core/utils/collision.utils'

const GameBoardContainer: React.FC = () => {
  const board = useGameStore((state) => state.board)
  const activePiece = useGameStore((state) => state.activePiece)
  const pendingClear = useGameStore((state) => state.pendingClear)

  const visibleBoard = useMemo(() => {
    if (!board) {
      return null
    }
    const startRow = board.height - BOARD_VISIBLE_HEIGHT
    return board.grid.slice(startRow)
  }, [board])

  const rowOffset = board ? board.height - BOARD_VISIBLE_HEIGHT : 0

  const clearedRows = useMemo(() => {
    if (!board || !pendingClear) {
      return []
    }

    const startRow = board.height - BOARD_VISIBLE_HEIGHT
    return pendingClear.lines
      .map((row) => row - startRow)
      .filter((row) => row >= 0 && row < BOARD_VISIBLE_HEIGHT)
  }, [board, pendingClear])

  const ghostPiece = useMemo(() => {
    if (!board || !activePiece) {
      return null
    }

    const { shape, position, color } = activePiece
    let ghostY = position.y

    while (isValidPosition(position.x, ghostY + 1, shape, board)) {
      ghostY += 1
    }

    return {
      shape,
      color,
      position: { x: position.x, y: ghostY },
    }
  }, [board, activePiece])

  return (
    <div className="game-board-container">
      <GameBoard
        board={visibleBoard || undefined}
        rowOffset={rowOffset}
        currentPiece={activePiece ? {
          shape: activePiece.shape,
          position: activePiece.position,
          color: activePiece.color,
        } : null}
        ghostPiece={ghostPiece}
        clearedRows={clearedRows}
      />
    </div>
  )
}

export default GameBoardContainer
