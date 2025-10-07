import { useGameStore, resetGameStore } from '../../src/game/gameStore'

describe('gameStore', () => {
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5)
    resetGameStore()
  })

  afterEach(() => {
    ;(Math.random as jest.MockedFunction<typeof Math.random>).mockRestore?.()
    resetGameStore()
  })

  const startPlaying = () => {
    useGameStore.getState().initializeGame()
    useGameStore.getState().beginGame()
  }

  test('starts a game with active piece and preview queue', () => {
    startPlaying()

    const state = useGameStore.getState()
    expect(state.status).toBe('playing')
    expect(state.activePiece).not.toBeNull()
    expect(state.nextQueue).toHaveLength(5)
    expect(state.canHold).toBe(true)
  })

  test('pauses and resumes gameplay', () => {
    startPlaying()

    useGameStore.getState().pauseGame()
    expect(useGameStore.getState().status).toBe('paused')

    useGameStore.getState().resumeGame()
    expect(useGameStore.getState().status).toBe('playing')
  })

  test('holding swaps pieces and disables hold until lock', () => {
    startPlaying()

    const firstType = useGameStore.getState().activePiece?.type
    expect(firstType).toBeDefined()

    useGameStore.getState().holdCurrentPiece()

    const afterHold = useGameStore.getState()
    expect(afterHold.holdPiece).toBe(firstType)
    expect(afterHold.canHold).toBe(false)

    const swappedType = afterHold.activePiece?.type
    expect(swappedType).not.toBeNull()

    useGameStore.getState().holdCurrentPiece()
    expect(useGameStore.getState().holdPiece).toBe(firstType)
  })
})
