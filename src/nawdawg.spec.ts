import assert from 'assert'
import nawdawg, { sleep, IMiddleware } from './nawdawg'

describe('nawdawg', function() {
  it(`should not delay at all if delayer returns false`, async function() {
    const foo = nawdawg({
      delayer() {
        return false
      },
    })
    const delay = await getMillisecondsToExecute(foo)
    assert(delay < 5, `should not delay`)
  })

  it(`should delay by default 100ms when no arguments provided`, async function() {
    const foo = nawdawg()
    const delay = await getMillisecondsToExecute(foo)
    assert(delay >= 100, `should delay by ~100ms`)
  })

  it(`should delay by 1 second when delayer is true and delay is 1000`, async function() {
    const foo = nawdawg({
      delay: 1000,
      delayer() {
        return true
      },
    })
    const delay = await getMillisecondsToExecute(foo)
    assert(delay >= 1000, `should delay by ~1 second`)
  })

  it(`should delay by 1.5 seconds when delayer is 1000 and is itself an async function that takes 50ms`, async function() {
    const foo = nawdawg({
      async delayer() {
        await sleep(500)
        return 1000
      },
    })
    const delay = await getMillisecondsToExecute(foo)
    assert(delay >= 1500, `should delay by ~1.5 second`)
  })
})

async function getMillisecondsToExecute(foo: IMiddleware): Promise<number> {
  const start = Date.now()
  let end = Date.now()
  const next = () => (end = Date.now())
  const _req: any = {}
  const _res: any = {}

  await foo(_req, _res, next)
  return end - start
}
