import { AnimatePresence, motion as Motion } from 'framer-motion'
import { useDeferredValue, useMemo, useState } from 'react'
import { FiLoader, FiSearch, FiX } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { destinations } from '../utils/destinationsData'

const defaultSuggestions = ['Rajasthan', 'Goa', 'Kerala', 'Spiti Valley', 'Hampi']

function LocationSearch({ className = '', placeholder = 'Search destinations in India', autoFocus = false, onSelected }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const deferredQuery = useDeferredValue(query)
  const isLoading = deferredQuery !== query

  const suggestionsPool = useMemo(() => {
    const values = [
      ...defaultSuggestions,
      ...destinations.map((destination) => destination.name),
      ...destinations.map((destination) => destination.state),
    ]
    return [...new Set(values)]
  }, [])

  const filteredSuggestions = useMemo(() => {
    if (!deferredQuery.trim()) {
      return suggestionsPool.slice(0, 6)
    }
    const lower = deferredQuery.toLowerCase()
    return suggestionsPool.filter((item) => item.toLowerCase().includes(lower)).slice(0, 8)
  }, [deferredQuery, suggestionsPool])

  const handleSelect = (value) => {
    setQuery(value)
    setIsOpen(false)
    navigate(`/explore?q=${encodeURIComponent(value)}`)
    if (onSelected) {
      onSelected(value)
    }
  }

  const handleKeyDown = (event) => {
    if (!isOpen) {
      setIsOpen(true)
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!filteredSuggestions.length) return
      setActiveIndex((prev) => (prev + 1) % filteredSuggestions.length)
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!filteredSuggestions.length) return
      setActiveIndex((prev) => (prev <= 0 ? filteredSuggestions.length - 1 : prev - 1))
    }
    if (event.key === 'Enter' && filteredSuggestions.length) {
      event.preventDefault()
      handleSelect(filteredSuggestions[activeIndex >= 0 ? activeIndex : 0])
    }
    if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-2 shadow-sm transition-colors duration-300 dark:border-slate-600 dark:bg-slate-900">
        <FiSearch className="text-slate-500 dark:text-slate-300" />
        <input
          value={query}
          autoFocus={autoFocus}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 140)}
          onChange={(event) => {
            setQuery(event.target.value)
            setActiveIndex(0)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-slate-700 outline-none dark:text-slate-100"
        />
        {isLoading ? (
          <FiLoader className="animate-spin text-slate-400 dark:text-slate-300" />
        ) : (
          query && (
            <button onClick={() => setQuery('')} className="text-slate-400 transition hover:text-slate-600 dark:text-slate-300">
              <FiX />
            </button>
          )
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <Motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-card transition-colors duration-300 dark:border-slate-700 dark:bg-darkcard dark:shadow-none"
          >
            {isLoading ? (
              <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-300">Loading suggestions...</div>
            ) : filteredSuggestions.length ? (
              filteredSuggestions.map((item, index) => (
                <button
                  key={item}
                  onMouseDown={() => handleSelect(item)}
                  className={`block w-full px-4 py-2 text-left text-sm transition ${
                    index === activeIndex
                      ? 'bg-primary/10 text-primary dark:bg-accent/20 dark:text-accent'
                      : 'text-slate-700 hover:bg-orange-50 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {item}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-300">No matching places found</div>
            )}
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LocationSearch
