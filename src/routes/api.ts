import { Router } from 'express'
import { promptGPT, promptMixtral } from '../lib/utils'
const router = Router()

router.get('/hello', (req, res) => {
  res.send('Hello World!')
})

export { router }
