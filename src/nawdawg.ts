import assert from 'assert'
import { Request, Response, NextFunction } from 'express'

type DelayerResult = boolean | Promise<boolean> | number | Promise<number>

export interface INawdawgOptions {
  delay?: number
  delayer?(req: Request): DelayerResult
}

export interface IMiddleware {
  <T>(req: Request & T, res: Response, next: NextFunction): Promise<void>
}

export default function nawdawg(opts?: number | INawdawgOptions): IMiddleware {
  return async function(
    req: Request,
    _: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (typeof opts === 'number') {
        await sleep(opts)
        return next()
      }

      opts = opts || {}
      opts.delay = opts.delay || 100
      opts.delayer = opts.delayer || NOOP

      assert(
        typeof opts.delay === 'number',
        `opts.delay should be a number of milliseconds to delay request`
      )
      assert(
        typeof opts.delayer === 'function',
        `opts.delayer must be a function`
      )

      const isAsync = opts.delayer.constructor.name === 'AsyncFunction'
      let delayerResult: DelayerResult
      if (isAsync) {
        delayerResult = await opts.delayer(req)
      } else {
        delayerResult = opts.delayer(req)
      }

      assert(
        ['boolean', 'number'].includes(typeof delayerResult),
        `result of delayer should be a boolean or number`
      )

      if (typeof delayerResult === 'number') {
        await sleep(delayerResult)
      } else if (delayerResult) {
        await sleep(opts.delay)
      }

      next()
    } catch (err) {
      next(err)
    }
  }
}

function NOOP() {
  return true
}

export async function sleep(ms: number): Promise<void> {
  return await new Promise((resolve) => setTimeout(resolve, ms))
}
