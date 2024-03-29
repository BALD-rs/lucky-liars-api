import { Request, Response } from 'express'
import { Router } from 'express'
import { startGame, getCharacterResponse } from '../lib/characters'
import { app } from '..'

const router = Router()

router.get('/hello', async (req, res) => {
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
    const game = app.locals.game
    const gameUUID: string = req.body.game_id
    const suspectName: string = req.body.name.toLowerCase()
    const roll: number = req.body.our_roll
    const message: string = req.body.message
    if (!(gameUUID in game && suspectName in game[gameUUID])) {
      res.status(400).json({
        message: 'invalid gameUUID and/or suspectName',
        confidence: 0,
      })
    } else {
      try {
        const response = await getCharacterResponse(gameUUID, suspectName, message, roll)
        res.status(200).json(response)
      } catch (error) {
        console.error(error)
        res.status(400).json({
          message: 'error, check the console',
          confidence: 0,
        })
      }
    }
  } else {
    res.status(400).json({
      message: 'bad usage, check the json body',
      confidence: 0,
    })
  }
})

router.post('/start', async (req: Request, res: Response) => {
  let resp
  try {
    resp = await startGame(app.locals.suspects)
    res.status(200)
  } catch (error) {
    console.error(error)
    res.status(400)
  }
  res.json(resp)
})

router.post('/clear', async (req: Request, res: Response) => {
  if ('gameUUID' in req.body) {
    const gameUUID: string = req.body.gameUUID
    delete app.locals.game[gameUUID]
    res.status(200)
  } else {
    res.status(400)
  }
})

export { router }
