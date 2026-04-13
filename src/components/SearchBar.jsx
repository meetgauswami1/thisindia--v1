import { AnimatePresence, motion as Motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { FiArrowRight, FiClock, FiLoader, FiMapPin, FiNavigation, FiPlus, FiSearch, FiX } from 'react-icons/fi'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchLocationSuggestions } from '../services/geocodingService'
import { useTravelData } from '../utils/TravelDataContext'

const HISTORY_KEY = 'thisindia_search_history'
const MAX_HISTORY = 5

const getHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  } catch {
    return []
  }
}

const saveToHistory = (label) => {
  try {
    const history = getHistory().filter((item) => item !== label)
    history.unshift(label)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)))
  } catch {}
}

const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch {}
}

function SearchBar({
  className = '',
  placeholder = 'Search destinations in India',
  autoFocus = false,
  navigateOnSelect = true,
  onSelected,
  mode = 'journey',
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const { setLocationAndLoad } = useTravelData()
  const isCompact = mode === 'compact'
  const [fromQuery, setFromQuery] = useState('')
  const [toQuery, setToQuery] = useState('')
  const [activeField, setActiveField] = useState('to')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [validationError, setValidationError] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [history, setHistory] = useState(getHistory)

  const query = activeField === 'from' ? fromQuery : toQuery
  const visibleSuggestions = useMemo(() => suggestions.slice(0, 8), [suggestions])
  const showHistory = open && !query.trim() && history.length > 0

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      setError('')
      setLoading(false)
      return
    }
    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        const result = await fetchLocationSuggestions(query)
        setSuggestions(result)
        setError(result.length ? '' : 'No locations found')
      } catch {
        setError('Could not load suggestions')
      } finally {
        setLoading(false)
      }
    }, 350)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    setFromQuery('')
    setToQuery('')
    setOpen(false)
    setValidationError('')
    setSuggestions([])
    setActiveIndex(0)
  }, [location.pathname])

  useEffect(() => {
    if (!('geolocation' in navigator)) return
    if (fromQuery) return
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude.toFixed(4)
          const lng = pos.coords.longitude.toFixed(4)
          const results = await fetchLocationSuggestions(`${lat},${lng}`)
          if (results && results[0]?.label) {
            setFromQuery(results[0].label)
          }
        } catch {
          return null
        }
      },
      () => {},
      { enableHighAccuracy: false, timeout: 7000, maximumAge: 60000 },
    )
  }, [fromQuery])

  const handleSelect = async (selection) => {
    const label = selection.label || selection
    if (activeField === 'from') {
      setFromQuery(label)
      setOpen(false)
      setValidationError('')
      if (onSelected) onSelected(selection)
      return
    }
    setToQuery(label)
    setOpen(false)
    setValidationError('')
    saveToHistory(label)
    setHistory(getHistory())
    await setLocationAndLoad(selection)
    if (navigateOnSelect) {
      navigate(`/explore?q=${encodeURIComponent(label)}`)
    }
    if (onSelected) onSelected(selection)
  }

  const handleSearch = async () => {
    const destination = toQuery.trim()
    if (!destination) {
      setValidationError('Enter a destination in "To"')
      return
    }
    setValidationError('')
    await handleSelect(destination)
  }

  const handleKeyDown = (event) => {
    if (!open) setOpen(true)
    if (event.key === 'ArrowDown' && visibleSuggestions.length) {
      event.preventDefault()
      setActiveIndex((prev) => (prev + 1) % visibleSuggestions.length)
    }
    if (event.key === 'ArrowUp' && visibleSuggestions.length) {
      event.preventDefault()
      setActiveIndex((prev) => (prev <= 0 ? visibleSuggestions.length - 1 : prev - 1))
    }
    if (event.key === 'Enter' && visibleSuggestions[activeIndex]) {
      event.preventDefault()
      handleSelect(visibleSuggestions[activeIndex])
      return
    }
    if (event.key === 'Enter' && !visibleSuggestions[activeIndex]) {
      event.preventDefault()
      handleSearch()
    }
    if (event.key === 'Escape') setOpen(false)
  }

  const wrapperClass = isCompact
    ? 'flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-2 shadow-sm transition-all duration-300 hover:border-orange-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-orange-200 dark:border-slate-600 dark:bg-slate-900 dark:hover:border-slate-500 dark:focus-within:ring-orange-500/20'
    : 'grid gap-2 rounded-2xl border border-orange-200/90 bg-white/95 p-2 shadow-card backdrop-blur transition-all duration-300 hover:border-orange-300 focus-within:border-primary focus-within:shadow-glow dark:border-slate-600 dark:bg-slate-900/95 md:grid-cols-[1fr,1fr,auto]'

  return (
    <div className={`relative ${className}`}>
      <div className={wrapperClass}>
        {isCompact ? (
          <>
            <FiSearch className="text-slate-500 dark:text-slate-300" />
            <input
              autoFocus={autoFocus}
              value={toQuery}
              onFocus={() => {
                setActiveField('to')
                setOpen(true)
              }}
              onBlur={() => setTimeout(() => setOpen(false), 120)}
              onChange={(event) => {
                setToQuery(event.target.value)
                setValidationError('')
                setActiveIndex(0)
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full bg-transparent text-sm text-slate-700 outline-none dark:text-slate-100"
            />
            {loading ? (
              <FiLoader className="animate-spin text-slate-400" />
            ) : (
              toQuery && (
                <button
                  onClick={() => setToQuery('')}
                  className="rounded-full p-1 text-slate-500 transition-colors hover:bg-orange-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <FiX />
                </button>
              )
            )}
          </>
        ) : (
          <>
            <label className="flex items-center gap-2 rounded-xl border border-transparent bg-orange-50/80 px-3 py-2 transition-all duration-300 hover:bg-orange-100/80 focus-within:border-orange-200 dark:bg-slate-800/70 dark:hover:bg-slate-800">
              <FiNavigation className="text-slate-500 dark:text-slate-300" />
              <input
                autoFocus={autoFocus}
                value={fromQuery}
                onFocus={() => {
                  setActiveField('from')
                  setOpen(true)
                }}
                onBlur={() => setTimeout(() => setOpen(false), 120)}
                onChange={(event) => {
                  setFromQuery(event.target.value)
                  setValidationError('')
                  setActiveIndex(0)
                }}
                onKeyDown={handleKeyDown}
                placeholder="From"
                className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100"
              />
            </label>
            <label className="flex items-center gap-2 rounded-xl border border-transparent bg-orange-50/80 px-3 py-2 transition-all duration-300 hover:bg-orange-100/80 focus-within:border-primary focus-within:ring-2 focus-within:ring-orange-200 dark:bg-slate-800/70 dark:hover:bg-slate-800 dark:focus-within:ring-orange-500/20">
              <FiMapPin className="text-primary dark:text-accent" />
              <input
                value={toQuery}
                onFocus={() => {
                  setActiveField('to')
                  setOpen(true)
                }}
                onBlur={() => setTimeout(() => setOpen(false), 120)}
                onChange={(event) => {
                  setToQuery(event.target.value)
                  setValidationError('')
                  setActiveIndex(0)
                }}
                onKeyDown={handleKeyDown}
                placeholder="To"
                className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100"
              />
              {loading ? (
                <FiLoader className="animate-spin text-slate-400" />
              ) : (
                toQuery && (
                  <button
                    onClick={() => setToQuery('')}
                    className="rounded-full p-1 text-slate-500 transition-colors hover:bg-orange-100 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <FiX />
                  </button>
                )
              )}
            </label>
            <button
              onClick={handleSearch}
              className="btn-gradient flex h-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm"
            >
              <FiSearch />
              Search
            </button>
          </>
        )}
      </div>

      {validationError && (
        <p className="mt-2 px-1 text-xs text-rose-500">{validationError}</p>
      )}

      <AnimatePresence>
        {/* Recent Search History */}
        {showHistory && !loading && !visibleSuggestions.length && (
          <Motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute left-0 right-0 top-full z-[95] mt-2 rounded-2xl border border-orange-100 bg-white shadow-card dark:border-slate-700 dark:bg-darkcard"
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-orange-50 dark:border-slate-700">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                🕐 Recent Searches
              </p>
              <button
                onPointerDown={() => {
                  clearHistory()
                  setHistory([])
                }}
                className="text-xs text-rose-400 hover:text-rose-500"
              >
                Clear All
              </button>
            </div>
            {history.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between gap-2 px-4 py-3 hover:bg-orange-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <button
                  onPointerDown={() => handleSelect(item)}
                  className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200 flex-1 text-left"
                >
                  <FiClock className="text-orange-400 shrink-0" />
                  {item}
                </button>
                <button
                  onPointerDown={(e) => {
                    e.stopPropagation()
                    const updated = history.filter((h) => h !== item)
                    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
                    setHistory(updated)
                  }}
                  className="text-slate-400 hover:text-rose-400"
                >
                  <FiX className="text-xs" />
                </button>
              </div>
            ))}
          </Motion.div>
        )}

        {/* Suggestions Dropdown */}
        {open && (loading || visibleSuggestions.length > 0 || (error && query.trim())) && (
          <Motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute left-0 right-0 top-full z-[95] mt-2 max-h-[52vh] overflow-y-auto overflow-x-hidden rounded-2xl border border-orange-100 bg-white shadow-card dark:border-slate-700 dark:bg-darkcard"
          >
            {loading ? (
              <p className="px-4 py-3 text-sm text-slate-500 dark:text-slate-300">
                Loading suggestions...
              </p>
            ) : visibleSuggestions.length ? (
              visibleSuggestions.map((item, index) => (
                <div
                  key={item.id || item.label}
                  className={`flex w-full min-w-0 items-center justify-between gap-2 border-l-2 px-3 py-3 text-left text-sm transition-all duration-200 sm:gap-3 sm:px-4 ${
                    index === activeIndex
                      ? 'border-primary bg-primary/10 text-primary dark:border-accent dark:bg-accent/20 dark:text-accent'
                      : 'border-transparent text-slate-700 hover:border-orange-300 hover:bg-orange-50 hover:pl-5 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800'
                  }`}
                >
                  <button
                    onPointerDown={() => handleSelect(item)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-slate-800 dark:text-orange-300">
                      <FiArrowRight className="text-xs" />
                    </span>
                    <span className="truncate">{item.label}</span>
                  </button>
                  <button
                    onPointerDown={(e) => {
                      e.stopPropagation()
                      const label = item.label
                      setToQuery(label)
                      window.dispatchEvent(new CustomEvent('planner:setTo', { detail: { label } }))
                      navigate(`/trip-planner?to=${encodeURIComponent(label)}`)
                    }}
                    className="ml-2 inline-flex shrink-0 items-center gap-1 rounded-full border border-orange-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 transition-colors hover:bg-orange-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 sm:ml-3 sm:text-xs"
                    title="Add to Destination"
                  >
                    <FiPlus className="text-[10px]" />
                    Add to Destination
                  </button>
                </div>
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-slate-500 dark:text-slate-300">{error}</p>
            )}
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar