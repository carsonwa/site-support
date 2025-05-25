import type { Message, ChatCompletionRequest, ChatCompletionResponse } from '../types/chat'
import { instructionService } from './instructionService'

const API_URL = 'https://api.openai.com/v1/chat/completions'

export async function sendMessage(messages: Message[], model: string, domain: string): Promise<Message> {
  const systemMessage: Message = {
    role: 'system',
    content: instructionService.getCombinedInstructions(domain)
  };
  const request: ChatCompletionRequest = {
    model,
    messages: [systemMessage, ...messages],
    temperature: 0.7,
    max_tokens: 500
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    const data: ChatCompletionResponse = await response.json()
    return data.choices[0].message
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
  }
} 