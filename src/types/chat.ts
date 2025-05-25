export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  function_call?: {
    name: string
    arguments: string
  }
}

export interface ChatCompletionRequest {
  model: string
  messages: Message[]
  temperature?: number
  max_tokens?: number
  functions?: Array<{
    name: string
    description: string
    parameters: {
      type: string
      properties: Record<string, any>
      required: string[]
    }
  }>
  function_call?: string
}

export interface ChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    index: number
    message: Message
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
} 