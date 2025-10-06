import { BoardState } from './board.types'
import { PieceState, PieceType } from './piece.types'

export type GameStatus = 'menu' | 'playing' | 'paused' | 'gameOver'

export interface GameState {
  board: BoardState
  currentPiece: PieceState | null
  nextPieces: PieceType[]
  holdPiece: PieceType | null
  canHold: boolean
  score: number
  level: number
  lines: number
  gameStatus: GameStatus
  isPaused: boolean
  combo: number
  lastClearWasTetris: boolean
  fallTimer: number
  lockTimer: number
  lockResets: number
}

export interface GameStats {
  totalGames: number
  totalScore: number
  totalLines: number
  totalPlayTime: number
  highScore: number
  highestLevel: number
  mostLines: number
  longestGame: number
  lineClearStats: {
    singles: number
    doubles: number
    triples: number
    tetrises: number
  }
}

export interface ScoreEvent {
  type: 'lineClear' | 'softDrop' | 'hardDrop' | 'combo' | 'backToBack'
  points: number
  level: number
  lines?: number
  combo?: number
}
