import { HoldRepeatController } from '../../src/game/HoldRepeatController'
import { ARR_DEFAULT, DAS_DEFAULT } from '../../src/core/constants/game.constants'

const globalObj = global as any

if (!globalObj.window) {
  globalObj.window = {
    setTimeout: (...args: Parameters<typeof setTimeout>) => setTimeout(...args),
    clearTimeout: (id: any) => clearTimeout(id),
    setInterval: (...args: Parameters<typeof setInterval>) => setInterval(...args),
    clearInterval: (id: any) => clearInterval(id),
  }
}

jest.useFakeTimers()

describe('HoldRepeatController', () => {
  test('fires immediately and repeats after DAS/ARR', () => {
    const action = jest.fn()
    const controller = new HoldRepeatController(action)

  controller.start()
  expect(action).toHaveBeenCalledTimes(1)

  jest.advanceTimersByTime(DAS_DEFAULT + ARR_DEFAULT)
  expect(action).toHaveBeenCalledTimes(2)

  jest.advanceTimersByTime(ARR_DEFAULT * 2)
  expect(action).toHaveBeenCalledTimes(4)

  controller.stop()
  jest.advanceTimersByTime(ARR_DEFAULT * 5)
  expect(action).toHaveBeenCalledTimes(4)
  })

  test('stop before DAS prevents repeats', () => {
    const action = jest.fn()
    const controller = new HoldRepeatController(action)

  controller.start()
  expect(action).toHaveBeenCalledTimes(1)

  jest.advanceTimersByTime(DAS_DEFAULT - 10)
  controller.stop()
  jest.advanceTimersByTime(DAS_DEFAULT + ARR_DEFAULT)
  expect(action).toHaveBeenCalledTimes(1)
})
})
