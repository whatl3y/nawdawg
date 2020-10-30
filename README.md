# nawdawg

An Express middleware to show those you don't like how much you really don't like them by adding a delay to your server's responses based on conditions you provide.

Did your boss add busy work to your already slammed plate during the last 1-on-1? Are you Bruce Wayne and Clark Kent is accessing your app and you want to show him who's boss? Is your CEO taking too many golf trips? Oh your ex just signed up to use your company's app(s)? Lulz, we'll see about that.

## Install

`$ npm install nawdawg`

## Usage/Examples

```js
import express from 'express'
import nawdawg from 'nawdawg'

const app = express()

// no arguments delays all requests by 100ms
app.use(nawdawg())

app.get('/', (req, res) => {
  res.send('At least 100ms has passed')
})
app.listen(8080)
```

```js
import express from 'express'
import nawdawg from 'nawdawg'

const app = express()

// delay all requests by 1 second (1000 milliseconds)
app.use(nawdawg(1000))

app.get('/', (req, res) => {
  res.send('At least 1 second has passed')
})
app.listen(8080)
```

```js
import express from 'express'
import nawdawg from 'nawdawg'

const app = express()

// delay all requests by user pos@acme.com (as defined in a session object on request) by 3 seconds
app.use(
  nawdawg({
    delay: 3000,
    delayer(req) {
      if (req.session.user === 'pos@acme.com') {
        return true
      }
      return false
    },
  })
)

app.get('/', (req, res) => {
  res.send(`If you're pos@acme.com, at least 3 seconds has passed`)
})
app.listen(8080)
```

```js
import express from 'express'
import nawdawg from 'nawdawg'

const app = express()

// delay all requests by `userObject.delayByThisManyMilliseconds` number of milliseconds
// as defined by a column in the DB
app.use(
  nawdawg({
    async delayer(req) {
      const userObject = await findUser(req.session.user)
      const milliseconds = userObject && userObject.delayByThisManyMilliseconds
      return milliseconds || false
    },
  })
)

app.get('/', (req, res) => {
  res.send(
    `If you're logged in and have a delayByThisManyMilliseconds, at least that many milliseconds has passed`
  )
})
app.listen(8080)
```

## API

**nawdawg** takes an optional `options` parameter that can be either a number that will delay all incoming requests by that number of milliseconds, or an object with the following parameters to control if and how to delay requests:

If options is not provided all requests will be delayed by 100ms.

- `options.delayer?: (req: express.Request): boolean | Promise<boolean> | number | Promise<number>`
  - If delayer has async operations in it, make sure it returns a Promise (by either being itself an async function or explicitly returning a Promise if you still use callbacks).
  - If delayer returns a number, the request will be delayed by that many milliseconds
  - If delayer returns a boolean, the request will only be delayed if it's `true` and will be delayed by `options.delay` milliseconds
- `options.delay?: number = 100`: the number of milliseconds to delay **if options.delayer returns a boolean**. If `options.delayer` returns a number, it will take precendent over `options.delay`.

```js
import express from 'express'
import nawdawg from 'nawdawg'

const app = express()
app.use(nawdawg(options))
```
