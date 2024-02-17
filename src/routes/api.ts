import { Request, Response } from 'express'
import { Router } from 'express'
import { prompt } from '../lib/utils'
const router = Router()

router.get('/hello', (req, res) => {
  res.send('Hello World!')
})

router.post('/interrogate', async (req: Request, res: Response) => {
  console.log(req.body)
  if (req.body.name && req.body.game_id && req.body.message && req.body.our_roll && req.body.sus_roll) {
    try {
      const response = await prompt('fireworks', req.body.message)
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
