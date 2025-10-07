import { create } from 'zustand'

import {
  BOARD_HEIGHT,
  BOARD_VISIBLE_HEIGHT,
  BOARD_WIDTH,
} from '../core/constants/game.constants'
import {
  getNextPiece,
  peekNextPieces,
  resetRandomizer,
} from '../core/utils/randomizer.utils'
import { BoardState, CellState } from '../core/types/board.types'
import { PieceState, PieceType } from '../core/types/piece.types'
import { Piece } from './Piece'
import { GravitySystem } from './GravitySystem'
import { LineClearSystem } from './LineClearSystem'
import {
  ScoreManager,
  ScoreState,
  ScoreStorageAdapter,
} from './ScoreManager'

const PREVIEW_COUNT = 5

type GameStatus = 'menu' | 'playing' | 'paused' | 'lineClearing' | 'gameOver'

interface PendingLineClear {
  remainingMs: number
  lines: number[]
}

interface RuntimeSystems {
  board: BoardState
  gravity: GravitySystem | null
  lineClear: LineClearSystem | null
  score: ScoreManager | null
  storage?: ScoreStorageAdapter
  startingLevel: number
}

interface GameStoreState {
  status: GameStatus
  board: BoardState
  activePiece: PieceState | null
  holdPiece: PieceType | null
  canHold: boolean
  nextQueue: PieceType[]
  pendingClear: PendingLineClear | null
  score: ScoreState
  startingLevel: number
  initializeGame: (options?: { startingLevel?: number; storage?: ScoreStorageAdapter }) => void
  beginGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  restartGame: () => void
  tick: (deltaMs: number) => void
  moveLeft: () => void
  moveRight: () => void
  softDrop: () => void
  hardDrop: () => void
  rotateClockwise: () => void
  rotateCounterClockwise: () => void
  holdCurrentPiece: () => void
}

const createEmptyRow = (): CellState[] => Array.from({ length: BOARD_WIDTH }, () => null)

const createEmptyBoard = (): BoardState => ({
  width: BOARD_WIDTH,
  height: BOARD_HEIGHT,
  visibleHeight: BOARD_VISIBLE_HEIGHT,
  grid: Array.from({ length: BOARD_HEIGHT }, () => createEmptyRow()),
})

const defaultScoreState = (level: number): ScoreState => ({
  score: 0,
  level,
  totalLines: 0,
  comboCount: -1,
  backToBack: false,
  highScore: 0,
})

const runtime: RuntimeSystems = {
  board: createEmptyBoard(),
  gravity: null,
  lineClear: null,
  score: null,
  startingLevel: 1,
}

const syncState = (set: (partial: Partial<GameStoreState>) => void) => {
  const gravity = runtime.gravity
  const score = runtime.score

  set({
    board: gravity ? gravity.getBoardState() : runtime.board,
    activePiece: gravity ? gravity.getPiece().getState() : null,
    score: score ? score.getState() : defaultScoreState(runtime.startingLevel),
  })
}

const ensurePreviewQueue = (): PieceType[] => {
  return peekNextPieces(PREVIEW_COUNT)
}

const spawnNextPiece = (set: (partial: Partial<GameStoreState>) => void, fromHold?: PieceType): boolean => {
  if (!runtime.gravity || !runtime.score) {
    return false
  }

  const nextType = fromHold ?? getNextPiece()

  let piece: Piece
  try {
    piece = Piece.spawn(nextType, runtime.board)
  } catch {
    runtime.gravity = null
    return false
  }

  runtime.gravity.setBoard(runtime.board)
  runtime.gravity.setPiece(piece)
  runtime.gravity.setLevel(runtime.score.getState().level)

  set({
    activePiece: piece.getState(),
    nextQueue: ensurePreviewQueue(),
  })

  return true
}

const handlePieceLock = (set: (partial: Partial<GameStoreState>) => void, get: () => GameStoreState) => {
  if (!runtime.gravity || !runtime.score || !runtime.lineClear) {
    return
  }

  const boardSnapshot = runtime.gravity.getBoardState()
  const clearCheck = runtime.lineClear.checkForLineClears(boardSnapshot)

  if (clearCheck.hasClears) {
    set({
      status: 'lineClearing',
      board: boardSnapshot,
      activePiece: null,
      canHold: false,
      pendingClear: {
        remainingMs: clearCheck.animationDuration,
        lines: clearCheck.clearedLines,
      },
    })
    return
  }

  runtime.score.registerNoLineClear()

  const spawned = spawnNextPiece(set)

  if (!spawned) {
    set({ status: 'gameOver', activePiece: null, board: runtime.board })
    return
  }

  set({
    board: runtime.gravity!.getBoardState(),
    score: runtime.score.getState(),
    canHold: true,
    pendingClear: null,
  })
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  status: 'menu',
  board: runtime.board,
  activePiece: null,
  holdPiece: null,
  canHold: true,
  nextQueue: [],
  pendingClear: null,
  score: defaultScoreState(runtime.startingLevel),
  startingLevel: runtime.startingLevel,

  initializeGame: (options) => {
    const startingLevel = options?.startingLevel ?? runtime.startingLevel
    const storage = options?.storage

    runtime.board = createEmptyBoard()
    runtime.lineClear = new LineClearSystem()
    runtime.score = new ScoreManager(startingLevel, storage)
    runtime.gravity = null
    runtime.storage = storage
    runtime.startingLevel = startingLevel

    resetRandomizer()

    const firstType = getNextPiece()
    let piece: Piece

    try {
      piece = Piece.spawn(firstType, runtime.board)
    } catch {
      set({ status: 'gameOver' })
      return
    }

    runtime.gravity = new GravitySystem(runtime.board, piece, { level: runtime.score.getState().level })

    set({
      status: 'menu',
      holdPiece: null,
      canHold: true,
      nextQueue: ensurePreviewQueue(),
      pendingClear: null,
      startingLevel,
    })

    syncState(set)
  },

  beginGame: () => {
    if (!runtime.gravity || !runtime.score) {
      return
    }

    set({ status: 'playing', canHold: true, pendingClear: null })
    syncState(set)
  },

  pauseGame: () => {
    if (get().status === 'playing') {
      set({ status: 'paused' })
    }
  },

  resumeGame: () => {
    if (get().status === 'paused') {
      set({ status: 'playing' })
    }
  },

  restartGame: () => {
    const currentStorage = runtime.storage
    const startingLevel = runtime.startingLevel
    get().initializeGame({ startingLevel, storage: currentStorage })
    get().beginGame()
  },

  tick: (deltaMs) => {
    const state = get()

    if (state.status === 'lineClearing') {
      const pending = state.pendingClear
      if (!pending || !runtime.lineClear || !runtime.score || !runtime.gravity) {
        return
      }

      const remaining = pending.remainingMs - deltaMs

      if (remaining > 0) {
        set({ pendingClear: { ...pending, remainingMs: remaining } })
        return
      }

      const result = runtime.lineClear.applyLineClear(runtime.board, pending.lines)
      runtime.board = result.board
      runtime.gravity.setBoard(runtime.board)

      runtime.score.addLineClear(result.linesCleared)

      const spawned = spawnNextPiece(set)

      if (!spawned) {
        set({
          status: 'gameOver',
          pendingClear: null,
          board: runtime.board,
          activePiece: null,
          score: runtime.score.getState(),
        })
        return
      }

      set({
        status: 'playing',
        pendingClear: null,
        board: runtime.gravity!.getBoardState(),
        score: runtime.score.getState(),
        canHold: true,
      })

      return
    }

    if (state.status !== 'playing' || !runtime.gravity) {
      return
    }

    const result = runtime.gravity.update(deltaMs)

    syncState(set)

    if (result.locked) {
      handlePieceLock(set, get)
    }
  },

  moveLeft: () => {
    if (get().status !== 'playing' || !runtime.gravity) {
      return
    }

    const piece = runtime.gravity.getPiece()
    const moved = piece.moveLeft(runtime.board)

    if (moved) {
      runtime.gravity.notifyPieceAction()
      syncState(set)
    }
  },

  moveRight: () => {
    if (get().status !== 'playing' || !runtime.gravity) {
      return
    }

    const piece = runtime.gravity.getPiece()
    const moved = piece.moveRight(runtime.board)

    if (moved) {
      runtime.gravity.notifyPieceAction()
      syncState(set)
    }
  },

  softDrop: () => {
    if (get().status !== 'playing' || !runtime.gravity || !runtime.score) {
      return
    }

    const piece = runtime.gravity.getPiece()
    const moved = piece.moveDown(runtime.board)

    if (moved) {
      runtime.score.addDropScore(1, false)
      runtime.gravity.notifyPieceAction()
      syncState(set)
    }
  },

  hardDrop: () => {
    if (get().status !== 'playing' || !runtime.gravity || !runtime.score) {
      return
    }

    const piece = runtime.gravity.getPiece()
    const dropped = piece.hardDrop(runtime.board)

    if (dropped > 0) {
      runtime.score.addDropScore(dropped, true)
    }

    runtime.gravity.forceLock()
    syncState(set)
    handlePieceLock(set, get)
  },

  rotateClockwise: () => {
    if (get().status !== 'playing' || !runtime.gravity) {
      return
    }

    const piece = runtime.gravity.getPiece()
    const rotated = piece.rotate(runtime.board)

    if (rotated) {
      runtime.gravity.notifyPieceAction()
      syncState(set)
    }
  },

  rotateCounterClockwise: () => {
    if (get().status !== 'playing' || !runtime.gravity) {
      return
    }

    const piece = runtime.gravity.getPiece()
    const rotated = piece.rotate(false, runtime.board)

    if (rotated) {
      runtime.gravity.notifyPieceAction()
      syncState(set)
    }
  },

  holdCurrentPiece: () => {
    const state = get()

    if (state.status !== 'playing' || !runtime.gravity || !state.canHold) {
      return
    }

    const current = runtime.gravity.getPiece()
    const currentType = current.type
    const holdTarget = state.holdPiece

    let spawned: boolean

    if (holdTarget) {
      spawned = spawnNextPiece(set, holdTarget)
      set({ holdPiece: currentType })
    } else {
      set({ holdPiece: currentType })
      spawned = spawnNextPiece(set)
    }

    if (!spawned) {
      set({ status: 'gameOver', activePiece: null })
      return
    }

    set({ canHold: false })
    syncState(set)
  },
}))

export const resetGameStore = (): void => {
  runtime.board = createEmptyBoard()
  runtime.gravity = null
  runtime.lineClear = null
  runtime.score = null
  runtime.storage = undefined
  runtime.startingLevel = 1

  useGameStore.setState({
    status: 'menu',
    board: runtime.board,
    activePiece: null,
    holdPiece: null,
    canHold: true,
    nextQueue: [],
    pendingClear: null,
    score: defaultScoreState(runtime.startingLevel),
    startingLevel: runtime.startingLevel,
  })
}
