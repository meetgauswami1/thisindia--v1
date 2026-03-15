import { useState } from 'react'
import { FiSend } from 'react-icons/fi'
import { HiOutlineSparkles } from 'react-icons/hi2'

const quickPrompts = [
  'Suggest hidden places in Gujarat',
  '3 day trip for Rajasthan',
  'Best winter destinations in India',
]

function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { id: 'init', role: 'assistant', text: 'Hi, I am your ThisIndia AI assistant. Ask me for hidden destination ideas.' },
  ])

  const sendMessage = (text) => {
    const value = text.trim()
    if (!value) return
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', text: value },
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: `Great request. I recommend starting with destination shortlisting, best season check, and a custom ${value.includes('day') ? value.match(/\d+/)?.[0] || 3 : 3}-day plan.`,
      },
    ])
    setInput('')
  }

  return (
    <div className="fixed bottom-24 right-4 z-50 md:bottom-6 md:right-6">
      {open && (
        <div className="card-surface mb-3 w-[320px] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-bold text-secondary dark:text-orange-300">AI Travel Assistant</h4>
            <button onClick={() => setOpen(false)} className="text-sm text-slate-500 dark:text-slate-300">
              Close
            </button>
          </div>
          <div className="mb-3 max-h-64 space-y-2 overflow-y-auto rounded-xl bg-orange-50/70 p-3 text-sm dark:bg-slate-800">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-xl px-3 py-2 ${
                  message.role === 'user'
                    ? 'bg-sunset-gradient text-white'
                    : 'bg-white text-slate-700 dark:bg-slate-700 dark:text-slate-100'
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="mb-2 flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 transition-colors duration-300 dark:bg-slate-700 dark:text-orange-300"
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
              placeholder="Ask for a trip..."
            />
            <button onClick={() => sendMessage(input)} className="btn-gradient rounded-xl px-3 py-2">
              <FiSend />
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="btn-gradient flex items-center gap-2 px-4 py-3 text-sm"
      >
        <HiOutlineSparkles />
        AI Assistant
      </button>
    </div>
  )
}

export default ChatbotWidget
