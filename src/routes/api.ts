import { Router } from 'express'
import { config } from 'dotenv'

config()
const router = Router()

router.get('/hello', (req, res) => {
  res.send('Hello World!')
  console.log(process.env)
})

export { router }
