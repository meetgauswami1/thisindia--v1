import { useState } from 'react'
import { FiMessageCircle, FiSend, FiX } from 'react-icons/fi'
import { sendAIChat } from '../services/aiChatService'
import { useTravelData } from '../utils/TravelDataContext'

const quickPrompts = [
  'What are the best places to visit here?',
  'Suggest a 2 day travel plan.',
  'What food should I try here?',
]

function AIChatAssistant() {
  const { selectedLocation } = useTravelData()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 'hello',
      role: 'assistant',
      content: 'Hi! I can help you discover attractions, food, weather tips, and trip plans.',
    },
  ])

  const handleSend = async (messageText) => {
    const text = messageText.trim()
    if (!text) return

    const historyForApi = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }))
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', content: text }])
    setInput('')
    setTyping(true)
    try {
      const answer = await sendAIChat({
        destination: selectedLocation?.label,
        history: historyForApi,
        message: text,
      })
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: answer }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: 'I am unable to answer right now. Please try again shortly.' },
      ])
    } finally {
      setTyping(false)
    }
  }

  return (
    <div className="fixed bottom-20 right-3 z-[65] md:bottom-6 md:right-6">
      {open && (
        <div className="card-surface mb-3 w-[min(92vw,340px)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-secondary dark:text-orange-300">AI Travel Assistant</h4>
              <p className="text-xs text-slate-500 dark:text-slate-300">{selectedLocation?.label || 'No destination selected'}</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-slate-500 dark:text-slate-300">
              <FiX />
            </button>
          </div>
          <div className="mb-3 max-h-72 space-y-2 overflow-y-auto rounded-xl bg-orange-50/70 p-3 dark:bg-slate-800">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-xl px-3 py-2 text-sm ${
                  message.role === 'user'
                    ? 'bg-sunset-gradient text-white'
                    : 'bg-white text-slate-700 dark:bg-slate-700 dark:text-slate-100'
                }`}
              >
                {message.content}
              </div>
            ))}
            {typing && <p className="text-xs text-slate-500 dark:text-slate-300">AI is typing...</p>}
          </div>
          <div className="mb-2 flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="rounded-full bg-orange-100 px-2 py-1 text-[11px] font-semibold text-orange-700 dark:bg-slate-700 dark:text-orange-300"
              >
                {prompt}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="input-surface w-full"
              placeholder="Ask about this destination..."
            />
            <button onClick={() => handleSend(input)} className="btn-gradient rounded-xl px-3 py-2">
              <FiSend />
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open AI Assistant"
        className="btn-gradient flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98] md:px-5 md:py-3"
      >
        <FiMessageCircle />
        AI Assistant
      </button>
    </div>
  )
}

export default AIChatAssistant
