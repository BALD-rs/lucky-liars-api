import express from 'express'
import { prompt, loadJson } from './lib/utils'

const app = express()
const port = 7474

// Remove any trailing slashes with redirect
// https://stackoverflow.com/a/15773824
app.use((req, res, next) => {
  if (req.path.slice(-1) === '/' && req.path.length > 1) {
    const query = req.url.slice(req.path.length)
    const safepath = req.path.slice(0, -1).replace(/\/+/g, '/')
    res.redirect(301, safepath + query)
  } else {
    next()
  }
})

// support for json requests
app.use(express.json())

// Add endpoints
import { router as apiRouter } from './routes/api'
app.use('/api/v1', apiRouter)

const init = async () => {
  try {
    app.locals.suspects = await loadJson('suspects.json')
    console.log(`${app.locals.suspects.length} suspects loaded`)
  } catch (error) {
    console.error('error loading suspects.json')
  }
  app.locals.game = {} // this will store game status, accessed by UUID
  app.listen(port, () => {
    console.info('Express server listening on http://127.0.0.1:' + port)
  })
}
init()

export { app }
