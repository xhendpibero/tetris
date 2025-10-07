import {
  ARR_DEFAULT,
  DAS_DEFAULT,
  PAUSE_INPUT_BUFFER,
} from '../core/constants/game.constants'
import { useGameStore } from './gameStore'

type StoreApi = typeof useGameStore

type Direction = 'left' | 'right'

interface MovementState {
  active: boolean
  dasTimer: number | null
  arrTimer: number | null
}

const MOVE_KEYS: Record<string, Direction> = {
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
}

const ROTATE_CW_KEYS = new Set(['ArrowUp', 'KeyX'])
const ROTATE_CCW_KEYS = new Set(['KeyZ', 'KeyS'])
const HOLD_KEYS = new Set(['ShiftLeft', 'ShiftRight', 'KeyC'])
const HARD_DROP_KEYS = new Set(['Space'])
const SOFT_DROP_KEYS = new Set(['ArrowDown'])
const PAUSE_KEYS = new Set(['Escape', 'KeyP'])

export class InputManager {
  private readonly store: StoreApi
  private readonly movementState: Record<Direction, MovementState> = {
    left: { active: false, dasTimer: null, arrTimer: null },
    right: { active: false, dasTimer: null, arrTimer: null },
  }
  private softDropTimer: number | null = null
  private lastPauseAt = 0
  private attached = false

  constructor(store: StoreApi = useGameStore) {
    this.store = store

    this.onKeyDown = this.onKeyDown.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
  }

  attach(): void {
    if (this.attached || typeof window === 'undefined') {
      return
    }

    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
    this.attached = true
  }

  detach(): void {
    if (!this.attached || typeof window === 'undefined') {
      return
    }

    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
    this.attached = false

    this.clearAllTimers()
  }

  private onKeyDown(event: KeyboardEvent): void {
    const { code, repeat } = event

    if (repeat) {
      // We'll handle auto repeat ourselves for movement keys
      event.preventDefault()
      return
    }

    const state = this.store.getState()
    const status = state.status

    if (status !== 'playing') {
      if (PAUSE_KEYS.has(code)) {
        this.handlePauseToggle(status)
        event.preventDefault()
      }
      return
    }

    if (MOVE_KEYS[code]) {
      event.preventDefault()
      this.handleMovementKeyDown(MOVE_KEYS[code])
      return
    }

    if (ROTATE_CW_KEYS.has(code)) {
      event.preventDefault()
      state.rotateClockwise()
      return
    }

    if (ROTATE_CCW_KEYS.has(code)) {
      event.preventDefault()
      state.rotateCounterClockwise()
      return
    }

    if (HOLD_KEYS.has(code)) {
      event.preventDefault()
      state.holdCurrentPiece()
      return
    }

    if (HARD_DROP_KEYS.has(code)) {
      event.preventDefault()
      state.hardDrop()
      return
    }

    if (SOFT_DROP_KEYS.has(code)) {
      event.preventDefault()
      this.startSoftDrop()
      return
    }

    if (PAUSE_KEYS.has(code)) {
      event.preventDefault()
      this.handlePauseToggle(status)
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    const { code } = event

    if (MOVE_KEYS[code]) {
      this.handleMovementKeyUp(MOVE_KEYS[code])
      return
    }

    if (SOFT_DROP_KEYS.has(code)) {
      this.stopSoftDrop()
    }
  }

  private handleMovementKeyDown(direction: Direction): void {
    const state = this.store.getState()

    const move = direction === 'left' ? state.moveLeft : state.moveRight
    move()

    const movement = this.movementState[direction]

    this.clearMovementTimers(direction)

    movement.active = true
    movement.dasTimer = window.setTimeout(() => {
      movement.arrTimer = window.setInterval(() => {
        const current = this.store.getState()
        if (current.status !== 'playing') {
          this.clearMovementTimers(direction)
          return
        }
        move()
      }, ARR_DEFAULT)
    }, DAS_DEFAULT)
  }

  private handleMovementKeyUp(direction: Direction): void {
    const movement = this.movementState[direction]
    movement.active = false
    this.clearMovementTimers(direction)
  }

  private startSoftDrop(): void {
    const state = this.store.getState()
    state.softDrop()

    this.stopSoftDrop()
    this.softDropTimer = window.setInterval(() => {
      const current = this.store.getState()
      if (current.status !== 'playing') {
        this.stopSoftDrop()
        return
      }
      current.softDrop()
    }, ARR_DEFAULT)
  }

  private stopSoftDrop(): void {
    if (this.softDropTimer !== null) {
      window.clearInterval(this.softDropTimer)
      this.softDropTimer = null
    }
  }

  private handlePauseToggle(status: string): void {
    const now = Date.now()
    if (now - this.lastPauseAt < PAUSE_INPUT_BUFFER) {
      return
    }

    this.lastPauseAt = now

    const state = this.store.getState()

    if (status === 'playing') {
      state.pauseGame()
    } else if (status === 'paused') {
      state.resumeGame()
    }
  }

  private clearMovementTimers(direction: Direction): void {
    const movement = this.movementState[direction]

    if (movement.dasTimer !== null) {
      window.clearTimeout(movement.dasTimer)
      movement.dasTimer = null
    }

    if (movement.arrTimer !== null) {
      window.clearInterval(movement.arrTimer)
      movement.arrTimer = null
    }
  }

  private clearAllTimers(): void {
    this.clearMovementTimers('left')
    this.clearMovementTimers('right')
    this.stopSoftDrop()
  }
}

export const createInputManager = () => new InputManager()
