const globalObj = global as unknown as Record<string, any>

const listeners = new Map<string, Set<(event: any) => void>>()

const ensureWindow = () => {
  if (globalObj.window) {
    return
  }

  const windowStub: Record<string, any> = {
    addEventListener: (type: string, handler: (event: any) => void) => {
      if (!listeners.has(type)) {
        listeners.set(type, new Set())
      }
      listeners.get(type)!.add(handler)
    },
    removeEventListener: (type: string, handler: (event: any) => void) => {
      listeners.get(type)?.delete(handler)
    },
    dispatchEvent: (event: any) => {
      const handlers = listeners.get(event.type)
      if (!handlers) {
        return true
      }
      handlers.forEach((handler) => handler(event))
      return !event.defaultPrevented
    },
    setTimeout: (...args: Parameters<typeof setTimeout>) => globalThis.setTimeout(...args),
    clearTimeout: (id: any) => globalThis.clearTimeout(id),
    setInterval: (...args: Parameters<typeof setInterval>) => globalThis.setInterval(...args),
    clearInterval: (id: any) => globalThis.clearInterval(id),
  }

  globalObj.window = windowStub
}

ensureWindow()

const { InputManager } = require('../../src/game/InputManager') as typeof import('../../src/game/InputManager')
const {
  ARR_DEFAULT,
  DAS_DEFAULT,
  PAUSE_INPUT_BUFFER,
} = require('../../src/core/constants/game.constants') as typeof import('../../src/core/constants/game.constants')

jest.useFakeTimers()

const triggerKey = (type: string, code: string, repeat = false) => {
  const event = {
    type,
    code,
    repeat,
    defaultPrevented: false,
    preventDefault() {
      this.defaultPrevented = true
    },
  }
  globalObj.window.dispatchEvent(event)
  return event
}

const createMockStore = () => {
  const state = {
    status: 'playing' as const,
    moveLeft: jest.fn(),
    moveRight: jest.fn(),
    softDrop: jest.fn(),
    hardDrop: jest.fn(),
    rotateClockwise: jest.fn(),
    rotateCounterClockwise: jest.fn(),
    holdCurrentPiece: jest.fn(),
    pauseGame: jest.fn(),
    resumeGame: jest.fn(),
  }

  return {
    state,
    getState: () => state,
  }
}

describe('InputManager', () => {
  afterEach(() => {
    jest.clearAllTimers()
    listeners.clear()
    ensureWindow()
  })

  test('handles left movement with DAS and ARR', () => {
    const store = createMockStore()
    const manager = new InputManager(store as any)
    manager.attach()

    triggerKey('keydown', 'ArrowLeft')
    expect(store.state.moveLeft).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(DAS_DEFAULT + ARR_DEFAULT)
    expect(store.state.moveLeft).toHaveBeenCalledTimes(2)

    jest.advanceTimersByTime(ARR_DEFAULT * 2)
    expect(store.state.moveLeft).toHaveBeenCalledTimes(4)

    triggerKey('keyup', 'ArrowLeft')
    jest.advanceTimersByTime(ARR_DEFAULT * 5)
    expect(store.state.moveLeft).toHaveBeenCalledTimes(4)

    manager.detach()
  })

  test('soft drop repeats while key is held', () => {
    const store = createMockStore()
    const manager = new InputManager(store as any)
    manager.attach()

    triggerKey('keydown', 'ArrowDown')
    expect(store.state.softDrop).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(ARR_DEFAULT * 2 + 1)
    expect(store.state.softDrop).toHaveBeenCalledTimes(3)

    triggerKey('keyup', 'ArrowDown')
    jest.advanceTimersByTime(ARR_DEFAULT * 2 + 1)
    expect(store.state.softDrop).toHaveBeenCalledTimes(3)

    manager.detach()
  })

  test('hard drop triggers once per keydown', () => {
    const store = createMockStore()
    const manager = new InputManager(store as any)
    manager.attach()

    triggerKey('keydown', 'Space')
    expect(store.state.hardDrop).toHaveBeenCalledTimes(1)

    triggerKey('keydown', 'Space', true)
    expect(store.state.hardDrop).toHaveBeenCalledTimes(1)

    manager.detach()
  })

  test('pause/resume respects buffer', () => {
    const store = createMockStore()
    const manager = new InputManager(store as any)
    manager.attach()

    triggerKey('keydown', 'Escape')
    expect(store.state.pauseGame).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(PAUSE_INPUT_BUFFER / 2)
    triggerKey('keydown', 'Escape')
    expect(store.state.resumeGame).not.toHaveBeenCalled()

    jest.advanceTimersByTime(PAUSE_INPUT_BUFFER)
    store.state.status = 'paused'
    triggerKey('keydown', 'Escape')
    expect(store.state.resumeGame).toHaveBeenCalledTimes(1)

    manager.detach()
  })
})
