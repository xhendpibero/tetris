import { ARR_DEFAULT, DAS_DEFAULT } from '../core/constants/game.constants'

export class HoldRepeatController {
  private dasTimer: number | null = null
  private arrTimer: number | null = null

  constructor(
    private readonly action: () => void,
    private readonly das: number = DAS_DEFAULT,
    private readonly arr: number = ARR_DEFAULT,
  ) {}

  start(): void {
    this.stop()
    this.action()

    this.dasTimer = window.setTimeout(() => {
      this.arrTimer = window.setInterval(() => {
        this.action()
      }, this.arr)
    }, this.das)
  }

  stop(): void {
    if (this.dasTimer !== null) {
      window.clearTimeout(this.dasTimer)
      this.dasTimer = null
    }

    if (this.arrTimer !== null) {
      window.clearInterval(this.arrTimer)
      this.arrTimer = null
    }
  }
}

export const createHoldRepeatController = (action: () => void): HoldRepeatController => {
  return new HoldRepeatController(action)
}
