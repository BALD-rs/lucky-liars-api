import { config } from 'dotenv'
import { OpenAI } from 'openai'
import * as fs from 'fs/promises'
import { randomInt } from 'crypto'
import axios from 'axios'

config()
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  baseURL: process.env.OPENAI_API_URL || '',
})
const OPENAI_MODEL = 'gpt-4-turbo-preview'
// const OPENAI_MODEL = 'gpt-3.5-turbo'
const fireworks = new OpenAI({
  apiKey: process.env.FIREWORKS_AI_API_KEY || '',
  baseURL: process.env.FIREWORKS_AI_API_URL || '',
})
const FIREWORKS_MODEL = 'accounts/fireworks/models/mixtral-8x7b-instruct'

const DEFAULT_TEMPERATURE = 1

// general LLM prompting. apiClient is either 'fireworks' or 'openai' right now
async function prompt(apiClient: string, prompts: string[], temperature: number = DEFAULT_TEMPERATURE): Promise<any> {
  if (prompts.length < 2) {
    return 'prompt needs at least 2 arguments'
  }
  const client = apiClient === 'fireworks' ? fireworks : openai
  const model = apiClient === 'fireworks' ? FIREWORKS_MODEL : OPENAI_MODEL
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = prompts.map((prompt, i) => {
    const role = i === 0 ? 'system' : i % 2 === 1 ? 'user' : 'assistant'
    const content = prompt
    return { role, content }
  })

  try {
    const response = await client.chat.completions.create({
      model,
      messages,
      temperature: temperature,
      max_tokens: 1000,
    })
    return response.choices[0].message.content
  } catch (error) {
    console.error(error)
    return "I couldn't tell you."
  }
}

async function loadJson(filePath: string): Promise<string> {
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    throw new Error(`Error loading JSON file ${filePath}`)
  }
}

// change the confidence percentage of a lie (to be sent to the polygraph) in accordance with the dice roll
// initialPercent: 0-100, roll: 1-20
function changePercentWithRoll(initialPercent: number, roll: number) {
  if (initialPercent > 50 && roll > 12) {
    return 25
  } else if (roll < 10 && randomInt(10) + 1 >= roll) {
    return 25
  }
  return 5
  // const offByRange = Math.round((1 - roll / 20) * 50)
  // let newPercent = randomInt(initialPercent - offByRange - 1, initialPercent + offByRange)
  // newPercent = newPercent < 0 ? 0 : newPercent > 100 ? 100 : newPercent
  // return Math.round(newPercent * 0.25)
}

export { prompt, loadJson, changePercentWithRoll }
