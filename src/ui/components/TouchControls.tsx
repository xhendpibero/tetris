import React, { useEffect, useMemo, useRef } from 'react'
import { useGameStore } from '@/game/gameStore'
import { HoldRepeatController } from '@/game/HoldRepeatController'

const SWIPE_THRESHOLD = 24
const HARD_DROP_THRESHOLD = 110
const FLICK_TIME = 160

const TouchControls: React.FC = () => {
  const status = useGameStore((state) => state.status)
  const storeApi = useGameStore

  const isPlaying = status === 'playing'

  const triggerAction = useMemo(() => {
    const vibrate = () => {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.(10)
      }
    }

    return (perform: (state: ReturnType<typeof storeApi.getState>) => void) => {
      const current = storeApi.getState()
      if (current.status !== 'playing') {
        return
      }
      perform(current)
      vibrate()
    }
  }, [storeApi])

  const leftControllerRef = useRef<HoldRepeatController>()
  const rightControllerRef = useRef<HoldRepeatController>()
  const softDropControllerRef = useRef<HoldRepeatController>()

  if (!leftControllerRef.current) {
    leftControllerRef.current = new HoldRepeatController(() => {
      triggerAction((state) => state.moveLeft())
    })
  }

  if (!rightControllerRef.current) {
    rightControllerRef.current = new HoldRepeatController(() => {
      triggerAction((state) => state.moveRight())
    })
  }

  if (!softDropControllerRef.current) {
    softDropControllerRef.current = new HoldRepeatController(() => {
      triggerAction((state) => state.softDrop())
    })
  }

  const gestureState = useRef({
    active: false,
    pointerId: 0,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    startTime: 0,
    horizontalDirection: null as 'left' | 'right' | null,
    softDropActive: false,
    hardDropTriggered: false,
  })

  useEffect(() => {
    if (!isPlaying) {
      leftControllerRef.current?.stop()
      rightControllerRef.current?.stop()
      softDropControllerRef.current?.stop()
      gestureState.current.horizontalDirection = null
      gestureState.current.softDropActive = false
      gestureState.current.hardDropTriggered = false
    }
  }, [isPlaying])

  useEffect(() => {
    return () => {
      leftControllerRef.current?.stop()
      rightControllerRef.current?.stop()
      softDropControllerRef.current?.stop()
    }
  }, [])

  const handlePointerDown = (
    controller: HoldRepeatController | undefined,
  ) => (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    controller?.start()
  }

  const handlePointerUp = (
    controller: HoldRepeatController | undefined,
  ) => () => {
    controller?.stop()
  }

  const handleRotate = () => {
    triggerAction((state) => state.rotateClockwise())
  }

  const handleHold = () => {
    triggerAction((state) => state.holdCurrentPiece())
  }

  const handleHardDrop = () => {
    triggerAction((state) => state.hardDrop())
  }

  const stopAllControllers = () => {
    leftControllerRef.current?.stop()
    rightControllerRef.current?.stop()
    softDropControllerRef.current?.stop()
    gestureState.current.horizontalDirection = null
    gestureState.current.softDropActive = false
  }

  const handleGesturePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isPlaying) {
      return
    }

    event.preventDefault()
    const surface = event.currentTarget
    surface.setPointerCapture(event.pointerId)

    gestureState.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      startTime: event.timeStamp,
      horizontalDirection: null,
      softDropActive: false,
      hardDropTriggered: false,
    }
  }

  const handleGesturePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const gesture = gestureState.current
    if (!gesture.active || gesture.pointerId !== event.pointerId) {
      return
    }

    const dx = event.clientX - gesture.startX
    const dy = event.clientY - gesture.startY
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)

    // Handle horizontal movement
    if (
      (gesture.horizontalDirection === null && absDx > SWIPE_THRESHOLD && absDx > absDy) ||
      (gesture.horizontalDirection !== null && Math.sign(dx) !== (gesture.horizontalDirection === 'right' ? 1 : -1))
    ) {
      const newDirection = dx > 0 ? 'right' : 'left'

      if (gesture.horizontalDirection !== newDirection) {
        if (gesture.horizontalDirection === 'left') {
          leftControllerRef.current?.stop()
        } else if (gesture.horizontalDirection === 'right') {
          rightControllerRef.current?.stop()
        }

        const controller = newDirection === 'left' ? leftControllerRef.current : rightControllerRef.current
        controller?.start()
        gesture.horizontalDirection = newDirection
      }
    }

    // Handle vertical movement for soft/hard drop
    if (!gesture.hardDropTriggered && absDy > SWIPE_THRESHOLD && absDy >= absDx) {
      const duration = event.timeStamp - gesture.startTime

      if (dy > HARD_DROP_THRESHOLD && duration < FLICK_TIME) {
        gesture.hardDropTriggered = true
        stopAllControllers()
        handleHardDrop()
        return
      }

      if (!gesture.softDropActive && dy > SWIPE_THRESHOLD) {
        softDropControllerRef.current?.start()
        gesture.softDropActive = true
      }
    }

    gesture.lastX = event.clientX
    gesture.lastY = event.clientY
  }

  const commitTapAction = (event: React.PointerEvent<HTMLDivElement>) => {
    const gesture = gestureState.current
    const dx = gesture.lastX - gesture.startX
    const dy = gesture.lastY - gesture.startY
    const duration = event.timeStamp - gesture.startTime

    if (
      Math.abs(dx) < SWIPE_THRESHOLD &&
      Math.abs(dy) < SWIPE_THRESHOLD &&
      duration < 220 &&
      !gesture.hardDropTriggered
    ) {
      handleRotate()
    }
  }

  const handleGesturePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    const gesture = gestureState.current
    if (!gesture.active || gesture.pointerId !== event.pointerId) {
      return
    }

    commitTapAction(event)

    stopAllControllers()
    const surface = event.currentTarget
    surface.releasePointerCapture?.(event.pointerId)

    gesture.active = false
    gesture.hardDropTriggered = false
  }

  return (
    <div className="touch-controls">
      <div className="touch-controls-container" style={{ position: 'relative' }}>
        <div className="touch-control-left">
          <button
            className="btn-touch"
            disabled={!isPlaying}
            onPointerDown={handlePointerDown(leftControllerRef.current)}
            onPointerUp={handlePointerUp(leftControllerRef.current)}
            onPointerLeave={handlePointerUp(leftControllerRef.current)}
            onPointerCancel={handlePointerUp(leftControllerRef.current)}
          >
            ←
          </button>
        </div>

        <div className="touch-control-center">
          <button
            className="btn-touch"
            onPointerDown={(event) => {
              event.preventDefault()
              handleRotate()
            }}
            disabled={!isPlaying}
          >
            ↻
          </button>
          <button
            className="btn-touch"
            onPointerDown={(event) => {
              event.preventDefault()
              handleHold()
            }}
            disabled={!isPlaying}
          >
            HOLD
          </button>
          <button
            className="btn-touch"
            onPointerDown={(event) => {
              event.preventDefault()
              handleHardDrop()
            }}
            disabled={!isPlaying}
          >
            ⬇ HARD
          </button>
        </div>

        <div className="touch-control-right">
          <button
            className="btn-touch"
            disabled={!isPlaying}
            onPointerDown={handlePointerDown(rightControllerRef.current)}
            onPointerUp={handlePointerUp(rightControllerRef.current)}
            onPointerLeave={handlePointerUp(rightControllerRef.current)}
            onPointerCancel={handlePointerUp(rightControllerRef.current)}
          >
            →
          </button>
        </div>

        <div className="touch-control-bottom">
          <button
            className="soft-drop-button"
            disabled={!isPlaying}
            onPointerDown={handlePointerDown(softDropControllerRef.current)}
            onPointerUp={handlePointerUp(softDropControllerRef.current)}
            onPointerLeave={handlePointerUp(softDropControllerRef.current)}
            onPointerCancel={handlePointerUp(softDropControllerRef.current)}
          >
            ↓ SOFT DROP
          </button>
        </div>
        <div
          className="touch-gesture-surface"
          style={{ position: 'absolute', inset: 0, background: 'transparent' }}
          onPointerDown={handleGesturePointerDown}
          onPointerMove={handleGesturePointerMove}
          onPointerUp={handleGesturePointerEnd}
          onPointerCancel={handleGesturePointerEnd}
        />
      </div>
    </div>
  )
}

export default TouchControls
