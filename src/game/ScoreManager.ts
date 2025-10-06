import {
  HIGH_SCORE_STORAGE_KEY,
  LINES_PER_LEVEL,
  calculateComboScore,
  calculateDropScore,
  calculateLevel,
  calculateLineClearScore,
} from '../core/constants/scoring.constants'

export interface ScoreStorageAdapter {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export interface ScoreState {
  score: number
  level: number
  totalLines: number
  comboCount: number
  backToBack: boolean
  highScore: number
}

export interface LineClearOptions {
  isBackToBackEligible?: boolean
}

export class ScoreManager {
  private readonly startingLevel: number
  private readonly storage?: ScoreStorageAdapter
  private readonly storageKey: string

  private score = 0
  private level: number
  private totalLines = 0
  private comboCount = -1
  private backToBackChain = false
  private highScore = 0

  constructor(startingLevel: number = 1, storage?: ScoreStorageAdapter, storageKey: string = HIGH_SCORE_STORAGE_KEY) {
    if (startingLevel < 1) {
      throw new Error('Starting level must be at least 1')
    }

    this.startingLevel = Math.min(startingLevel, Number.MAX_SAFE_INTEGER)
    this.level = this.startingLevel
    this.storage = storage
    this.storageKey = storageKey

    this.highScore = this.loadHighScore()
  }

  getState(): ScoreState {
    return {
      score: this.score,
      level: this.level,
      totalLines: this.totalLines,
      comboCount: Math.max(this.comboCount, -1),
      backToBack: this.backToBackChain,
      highScore: this.highScore,
    }
  }

  addLineClear(linesCleared: number, options: LineClearOptions = {}): number {
    if (linesCleared < 0 || !Number.isInteger(linesCleared)) {
      throw new Error('linesCleared must be a non-negative integer')
    }

    if (linesCleared === 0) {
      this.resetCombo()
      this.resetBackToBack()
      return 0
    }

    this.totalLines += linesCleared
    this.level = calculateLevel(this.totalLines, this.startingLevel)

    this.comboCount = this.comboCount >= 0 ? this.comboCount + 1 : 0

    const isTetris = linesCleared === 4
    const isBackToBack = isTetris && (this.backToBackChain || options.isBackToBackEligible)

    const lineScore = calculateLineClearScore(linesCleared, this.level, isBackToBack)
    const comboScore = this.calculateComboScoreContribution()

    this.score += lineScore + comboScore

    this.backToBackChain = isTetris

    this.updateHighScore()

    return lineScore + comboScore
  }

  addDropScore(cellsDropped: number, isHardDrop: boolean): number {
    if (cellsDropped <= 0) {
      return 0
    }

    const dropScore = calculateDropScore(cellsDropped, isHardDrop)
    this.score += dropScore
    this.updateHighScore()
    return dropScore
  }

  registerNoLineClear(): void {
    this.resetCombo()
    this.resetBackToBack()
  }

  reset(): void {
    this.score = 0
    this.level = this.startingLevel
    this.totalLines = 0
    this.comboCount = -1
    this.backToBackChain = false
  }

  getLinesUntilLevelUp(): number {
    const linesIntoLevel = this.totalLines % LINES_PER_LEVEL
    return LINES_PER_LEVEL - linesIntoLevel
  }

  private calculateComboScoreContribution(): number {
    if (this.comboCount <= 0) {
      return 0
    }

    return calculateComboScore(this.comboCount, this.level)
  }

  private resetCombo(): void {
    this.comboCount = -1
  }

  private resetBackToBack(): void {
    this.backToBackChain = false
  }

  private loadHighScore(): number {
    if (!this.storage) {
      return 0
    }

    const stored = this.storage.getItem(this.storageKey)

    if (!stored) {
      return 0
    }

    const parsed = Number.parseInt(stored, 10)
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
  }

  private updateHighScore(): void {
    if (this.score <= this.highScore) {
      return
    }

    this.highScore = this.score

    if (this.storage) {
      this.storage.setItem(this.storageKey, String(this.highScore))
    }
  }
}

export const createScoreManager = (
  startingLevel?: number,
  storage?: ScoreStorageAdapter,
  storageKey?: string,
): ScoreManager => new ScoreManager(startingLevel, storage, storageKey)
