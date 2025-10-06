import { ScoreManager } from '../../src/game/ScoreManager'
import {
  BACK_TO_BACK_MULTIPLIER,
  HARD_DROP_POINTS,
  LINE_CLEAR_POINTS,
  LINES_PER_LEVEL,
} from '../../src/core/constants/scoring.constants'

const createStorageAdapter = () => {
  const data = new Map<string, string>()

  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value)
    },
  }
}

describe('ScoreManager', () => {
  test('awards base line clear scores with level multiplier', () => {
    const manager = new ScoreManager(1)
    const gained = manager.addLineClear(1)

    expect(gained).toBe(LINE_CLEAR_POINTS.single)

    const state = manager.getState()
    expect(state.score).toBe(LINE_CLEAR_POINTS.single)
    expect(state.level).toBe(1)
    expect(state.totalLines).toBe(1)
  })

  test('levels up after clearing required number of lines', () => {
    const manager = new ScoreManager(1)

    // Clear lines in batches and break combo each time
    while (manager.getState().totalLines < LINES_PER_LEVEL) {
      manager.addLineClear(2)
      manager.registerNoLineClear()
    }

    expect(manager.getState().level).toBe(2)
    expect(manager.getLinesUntilLevelUp()).toBe(LINES_PER_LEVEL)
  })

  test('applies back-to-back Tetris bonus and combo scoring', () => {
    const manager = new ScoreManager(1)

    const first = manager.addLineClear(4)
    const second = manager.addLineClear(4)

    const expectedFirst = LINE_CLEAR_POINTS.tetris
    const expectedSecond = Math.floor(LINE_CLEAR_POINTS.tetris * BACK_TO_BACK_MULTIPLIER) + 50 // combo level 1

    expect(first).toBe(expectedFirst)
    expect(second).toBe(expectedSecond)
    expect(manager.getState().score).toBe(expectedFirst + expectedSecond)
    expect(manager.getState().backToBack).toBe(true)
    expect(manager.getState().comboCount).toBe(1)
  })

  test('resets combo and back-to-back chain when no lines are cleared', () => {
    const manager = new ScoreManager(1)

    manager.addLineClear(2)
    expect(manager.getState().comboCount).toBe(0)
    expect(manager.getState().backToBack).toBe(false)

    manager.addLineClear(1)
    expect(manager.getState().comboCount).toBe(1)

    manager.registerNoLineClear()
    expect(manager.getState().comboCount).toBe(-1)
    expect(manager.getState().backToBack).toBe(false)
  })

  test('adds drop score for soft and hard drops', () => {
    const manager = new ScoreManager(1)
    const hardDropScore = manager.addDropScore(5, true)
    const softDropScore = manager.addDropScore(3, false)

    expect(hardDropScore).toBe(5 * HARD_DROP_POINTS)
    expect(softDropScore).toBe(3)
    expect(manager.getState().score).toBe(hardDropScore + softDropScore)
  })

  test('persists and restores high score using storage adapter', () => {
    const storage = createStorageAdapter()

    const firstSession = new ScoreManager(1, storage)
    firstSession.addLineClear(4)

    expect(firstSession.getState().highScore).toBe(LINE_CLEAR_POINTS.tetris)

    const secondSession = new ScoreManager(1, storage)
    expect(secondSession.getState().highScore).toBe(LINE_CLEAR_POINTS.tetris)

    secondSession.addLineClear(4)
    secondSession.addLineClear(4)

    const newState = secondSession.getState()
    expect(newState.score).toBeGreaterThan(LINE_CLEAR_POINTS.tetris)
    expect(newState.highScore).toBe(newState.score)
  })

  test('throws when given invalid line clear count', () => {
    const manager = new ScoreManager(1)
    expect(() => manager.addLineClear(-1)).toThrow('linesCleared must be a non-negative integer')
  })
})
