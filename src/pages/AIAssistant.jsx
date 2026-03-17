import { useEffect, useRef, useState } from 'react'
import { FiSend } from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'  // ← ADD THIS LINE
import { sendAIChat } from '../services/aiChatService'
import { useTravelData } from '../utils/TravelDataContext'
import { useI18n } from '../utils/I18nContext'

const quickPrompts = [
  'Suggest hidden places in Gujarat',
  '3 day trip for Rajasthan',
  'Best winter destinations in India',
]

function AIAssistant() {
  const { t } = useI18n()
  const { selectedLocation } = useTravelData()
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState(() => {
    const cached = sessionStorage.getItem('thisindia_ai_page_chat')
    if (cached) {
      try {
        return JSON.parse(cached)
      } catch {
        return [{ id: 'hello', role: 'assistant', content: 'Hi! Ask me for personalized hidden-gem travel plans.' }]
      }
    }
    return [{ id: 'hello', role: 'assistant', content: 'Hi! Ask me for personalized hidden-gem travel plans.' }]
  })
  const listRef = useRef(null)

  useEffect(() => {
    sessionStorage.setItem('thisindia_ai_page_chat', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, typing])

  const sendMessage = async (textValue) => {
    const text = textValue.trim()
    if (!text) return
    const historyForApi = messages.map((item) => ({ role: item.role, content: item.content }))
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
        { id: crypto.randomUUID(), role: 'assistant', content: 'I could not respond right now. Please try again.' },
      ])
    } finally {
      setTyping(false)
    }
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="heading-text text-3xl">{t('pages.aiAssistantTitle')}</h1>
        <p className="muted-text mt-1 text-sm">Chat with your travel co-pilot for hidden gems, weather-smart suggestions, and itinerary ideas.</p>
      </header>
      <div className="card-surface space-y-4 p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="heading-text text-xl">AI Conversation</h3>
          <span className="chip-surface text-xs">{selectedLocation?.label || 'No destination selected'}</span>
        </div>
        <div ref={listRef} className="max-h-[52vh] space-y-2 overflow-y-auto rounded-2xl bg-orange-50/70 p-3 dark:bg-slate-800">
          {messages.map((message) => (
            <div className={`max-w-[92%] rounded-xl px-3 py-2 text-sm ${
  message.role === 'user'
    ? 'ml-auto bg-sunset-gradient text-white'
    : 'bg-white text-slate-700 dark:bg-slate-700 dark:text-slate-100'
}`}>
  {message.role === 'user' ? (
    message.content
  ) : (
    <div className="prose prose-sm max-w-none
      prose-headings:text-orange-600
      prose-headings:font-semibold
      prose-headings:mb-1
      prose-p:text-slate-700
      prose-p:leading-relaxed
      prose-p:my-1
      prose-strong:text-slate-800
      prose-strong:font-semibold
      prose-ul:list-disc
      prose-ul:pl-4
      prose-ul:my-1
      prose-li:text-slate-700
      prose-li:my-0
      dark:prose-headings:text-orange-400
      dark:prose-p:text-slate-100
      dark:prose-strong:text-slate-200
      dark:prose-li:text-slate-200">
      <ReactMarkdown>{message.content}</ReactMarkdown>
    </div>
  )}
</div>
          ))}
          {typing && <p className="text-xs text-slate-500 dark:text-slate-300">AI is typing...</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => sendMessage(prompt)}
              className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 transition-colors hover:bg-orange-200 dark:bg-slate-700 dark:text-orange-300 dark:hover:bg-slate-600"
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                sendMessage(input)
              }
            }}
            className="input-surface w-full"
            placeholder="Ask for hidden gems, itineraries, food, routes..."
          />
          <button onClick={() => sendMessage(input)} className="btn-gradient rounded-xl px-4 py-2">
            <FiSend />
          </button>
        </div>
      </div>
    </section>
  )
}

export default AIAssistant
