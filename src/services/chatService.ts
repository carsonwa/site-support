import type { Message, ChatCompletionRequest, ChatCompletionResponse } from '../types/chat'
import { instructionService } from './instructionService'

const API_URL = 'https://api.openai.com/v1/chat/completions'

const supportFunction = {
  name: "support_response",
  description: "Respond to a support request",
  parameters: {
    type: "object",
    properties: {
      reply: { type: "string", description: "The main support message" },
      cli_command: { type: ["string", "null"], description: "CLI command to suggest, or null" },
      escalate: { type: "boolean", description: "Whether to escalate the ticket" }
    },
    required: ["reply", "cli_command", "escalate"]
  }
};

export async function sendMessage(messages: Message[], model: string, domain: string, userName: string): Promise<Message> {
  const systemMessage: Message = {
    role: 'system',
    content: instructionService.getCombinedInstructions(domain, userName)
  };
  const request: ChatCompletionRequest = {
    model,
    messages: [systemMessage, ...messages],
    temperature: 0.7,
    max_tokens: 500,
    functions: [supportFunction],
    function_call: "auto"
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
    const message = data.choices[0].message

    // If the response includes a function call, parse it
    if (message.function_call) {
      const args = JSON.parse(message.function_call.arguments);
      return {
        role: 'assistant',
        content: args.reply,
        function_call: {
          name: message.function_call.name,
          arguments: message.function_call.arguments
        }
      };
    }

    return message;
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
  }
} 