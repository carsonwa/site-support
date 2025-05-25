import { useState, useRef, useEffect } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import type { Message } from '../types/chat'
import { sendMessage } from '../services/chatService'

const SAMPLE_DOMAINS = [
  'website1.com',
  'website2.com',
  'website3.com',
  'website4.com',
  'website5.com',
  'website6.com',
  'website7.com',
  'website8.com',
  'website9.com',
  'website10.com'
]

const AVAILABLE_MODELS = [
  { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini' },
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'gpt-3.5-turbo-16k', name: 'GPT-3.5 Turbo 16K' }
]

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState('')
  const [selectedModel, setSelectedModel] = useState('gpt-4.1-mini')
  const [userName, setUserName] = useState('')
  const [cliCommand, setCliCommand] = useState<string | null>(null)
  const [showCliPrompt, setShowCliPrompt] = useState(false)
  const [shouldShowEscalate, setShouldShowEscalate] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !selectedDomain) return

    const userMessage: Message = { 
      role: 'user', 
      content: input
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setShowCliPrompt(false)
    setShouldShowEscalate(false)
    setCliCommand(null)

    try {
      const response = await sendMessage([...messages, userMessage], selectedModel, selectedDomain, userName)
      // If the response includes a function call, parse it
      if (response.function_call) {
        const args = JSON.parse(response.function_call.arguments);
        setMessages(prev => [...prev, { role: 'assistant', content: args.reply }]);
        setCliCommand(args.cli_command && args.cli_command !== 'null' ? args.cli_command : null);
        setShowCliPrompt(!!args.cli_command && args.cli_command !== 'null');
        setShouldShowEscalate(!!args.escalate);
      } else {
        // fallback: show raw content
        setMessages(prev => [...prev, response]);
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading && input.trim() && selectedDomain) {
        // Manually trigger submit
        const fakeEvent = { preventDefault: () => {} } as React.FormEvent
        handleSubmit(fakeEvent)
      }
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white border-b p-4">
        <div className="w-full space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                id="username"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name (optional)"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                Select AI Model
              </label>
              <select
                id="model"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {AVAILABLE_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
              Select your website
            </label>
            <select
              id="domain"
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select a website</option>
              {SAMPLE_DOMAINS.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="w-full space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 text-left whitespace-pre-line ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 shadow-md'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 rounded-lg px-4 py-2 shadow-md">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CLI Command Prompt */}
      {cliCommand && showCliPrompt && (
        <div className="p-4 bg-blue-50 border-t border-b border-blue-200 flex flex-col items-center">
          <div className="mb-2 text-sm text-blue-900 font-semibold">The assistant suggests running this CLI command:</div>
          <pre className="bg-gray-900 text-green-200 p-4 rounded border border-gray-700 text-sm font-mono mb-2 whitespace-pre-wrap w-full overflow-x-auto" style={{ fontSize: '1rem' }}>{cliCommand}</pre>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold"
              onClick={() => { setShowCliPrompt(false); alert('CLI command executed! (Demo)'); }}
            >
              Yes, Run Command
            </button>
            <button
              className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold"
              onClick={() => setShowCliPrompt(false)}
            >
              No
            </button>
          </div>
        </div>
      )}

      {/* Escalate Ticket Button */}
      {shouldShowEscalate && (
        <div className="p-4 bg-green-50 border-t border-b border-green-200 flex flex-col items-center">
          <div className="mb-2 text-sm text-green-900 font-semibold text-center">
            A SiteSupport team member is ready to assist you further. Click below and we'll take a closer look at your issue!
          </div>
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 shadow"
            onClick={() => alert('Ticket escalated! (Demo)')}
          >
            Ask SiteSupport for Help
          </button>
        </div>
      )}

      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex space-x-4 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onInput={e => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
              onKeyDown={handleInputKeyDown}
              rows={3}
              placeholder={selectedDomain ? "Describe your website issue..." : "Please select a website first"}
              disabled={!selectedDomain}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none min-h-[3em]"
              style={{ minHeight: '3em', maxHeight: '200px' }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim() || !selectedDomain}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 