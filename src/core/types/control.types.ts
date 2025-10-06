export type ControlType = 'keyboard' | 'touch' | 'gestures' | 'hybrid'

export interface InputState {
  left: boolean
  right: boolean
  down: boolean
  up: boolean
  space: boolean
  hold: boolean
  pause: boolean
  restart: boolean
}

export interface KeyMapping {
  left: string[]
  right: string[]
  down: string[]
  rotateClockwise: string[]
  rotateCounterClockwise: string[]
  hardDrop: string[]
  hold: string[]
  pause: string[]
  restart: string[]
  mute: string[]
}

export interface TouchControls {
  moveLeft: boolean
  moveRight: boolean
  softDrop: boolean
  hardDrop: boolean
  rotate: boolean
  hold: boolean
}

export interface ControlSettings {
  das: number
  arr: number
  controlType: ControlType
  vibrationEnabled: boolean
}

export type SwipeDirection = 'up' | 'down' | 'left' | 'right'

export interface SwipeEvent {
  direction: SwipeDirection
  distance: number
  duration: number
  startPosition: { x: number; y: number }
  endPosition: { x: number; y: number }
}
