import { Request, Response } from 'express'
import { Router } from 'express'
import { prompt } from '../lib/utils'
const router = Router()

router.get('/hello', (req, res) => {
  res.send('Hello World!')
})

router.post('/interrogate', async (req: Request, res: Response) => {
  if (
    'name' in req.body &&
    'game_id' in req.body &&
    'message' in req.body &&
    'our_roll' in req.body &&
    'sus_roll' in req.body
  ) {
    try {
      const response = await prompt('openai', req.body.message)
      res.json({
        response,
      })
    } catch (error) {
      res.json({
        error,
      })
    }
  } else {
    res.json({
      error: 'bad usage',
    })
  }
})

export { router }
