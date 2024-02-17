import { Router } from 'express'
import { prompt } from '../lib/utils'
const router = Router()

router.get('/hello', (req, res) => {
  res.send('Hello World!')
})

router.post('/character', async (req, res) => {
  res.send(await prompt('gpt', 'why are your fingerprints on the weapon'))
})

export { router }
