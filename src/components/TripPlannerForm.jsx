import { AnimatePresence, motion as Motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchLocationSuggestions } from '../services/geocodingService'
import { useI18n } from '../utils/I18nContext'

const defaultForm = {
  from: '',
  to: '',
  destination: '',
  duration: '3',
  durationMode: 'preset',
  customDuration: '3 days',
  budget: '',
  members: '2',
  customMembers: '',
  travelStyle: 'Culture',
  travelType: 'Solo',
}



function TripPlannerForm({ onGenerate, compact = false }) {
  const [searchParams] = useSearchParams()
  const { t } = useI18n()
  const [form, setForm] = useState(() => {
    const prefilledTo = searchParams.get('to') || ''
    return { ...defaultForm, to: prefilledTo, destination: prefilledTo }
  })
  const [validationError, setValidationError] = useState('')
  const [toSuggestions, setToSuggestions] = useState([])
  const [toOpen, setToOpen] = useState(false)
  const [toLoading, setToLoading] = useState(false)
  const [toError, setToError] = useState('')
  const [toActiveIndex, setToActiveIndex] = useState(0)

  const parsedCustomDurationDays = useMemo(() => {
    const match = form.customDuration.match(/\d+/)
    const parsed = Number(match?.[0] || 1)
    if (!Number.isFinite(parsed)) {
      return 1
    }
    return Math.max(1, Math.min(30, parsed))
  }, [form.customDuration])

  const formattedBudget = useMemo(() => {
    const value = Number(form.budget)
    if (!Number.isFinite(value) || value <= 0) {
      return ''
    }
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
  }, [form.budget])

  useEffect(() => {
    const handler = (event) => {
      const label = event?.detail?.label
      if (label) {
        setForm((prev) => ({ ...prev, to: label }))
      }
    }
    window.addEventListener('planner:setTo', handler)
    return () => window.removeEventListener('planner:setTo', handler)
  }, [])

  useEffect(() => {
    if (!('geolocation' in navigator)) return
    if (form.from) return
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude.toFixed(4)
          const lng = pos.coords.longitude.toFixed(4)
          const results = await fetchLocationSuggestions(`${lat},${lng}`)
          if (results && results[0]?.label) {
            setForm((prev) => ({ ...prev, from: results[0].label }))
          }
        } catch {
          return null
        }
      },
      () => {},
      { enableHighAccuracy: false, timeout: 7000, maximumAge: 60000 },
    )
  }, [form.from])

  useEffect(() => {
    if (!form.to || form.to.trim().length < 3) {
      setToSuggestions([])
      setToError('')
      setToLoading(false)
      return
    }
    setToLoading(true)
    const timer = setTimeout(async () => {
      try {
        const result = await fetchLocationSuggestions(form.to)
        setToSuggestions(result)
        setToError(result.length ? '' : 'No locations found')
      } catch {
        setToError('Could not load suggestions')
      } finally {
        setToLoading(false)
      }
    }, 320)
    return () => clearTimeout(timer)
  }, [form.to])

  const selectToSuggestion = (item) => {
    const label = item.label || item
    setForm((prev) => ({ ...prev, to: label, destination: label }))
    setToOpen(false)
    setToActiveIndex(0)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const destination = form.to || form.destination || ''
    const budgetValue = Number(form.budget)
    const durationSource = form.durationMode === 'custom' ? form.customDuration : form.duration
    const durationMatch = String(durationSource).match(/\d+/)
    const durationValue = Number(durationMatch?.[0] || durationSource)
    const travelers = form.members === 'custom' ? Number(form.customMembers) : Number(form.members)
    if (!Number.isFinite(budgetValue) || budgetValue <= 0) {
      setValidationError('Please enter a valid budget amount.')
      return
    }
    if (!Number.isFinite(durationValue) || durationValue <= 0) {
      setValidationError('Please enter a valid trip duration.')
      return
    }
    if (!Number.isFinite(travelers) || travelers < 1 || travelers > 50) {
      setValidationError('Travelers must be between 1 and 50.')
      return
    }
    setValidationError('')
    onGenerate({
      ...form,
      duration: String(durationValue),
      budget: budgetValue,
      destination,
      travelers,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="card-surface space-y-4 p-5 md:p-6">
      <h3 className="heading-text text-xl">AI Trip Planner</h3>
      <div className={`grid gap-3 ${compact ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
        <label className="space-y-1 text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-200">{t('common.tripFrom')}</span>
          <input
            value={form.from}
            onChange={(event) => setForm((prev) => ({ ...prev, from: event.target.value }))}
            className="input-surface w-full"
            placeholder="Starting city"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-200">{t('common.tripTo')}</span>
          <div className="relative">
            <input
              required
              value={form.to}
              onFocus={() => setToOpen(true)}
              onBlur={() => setTimeout(() => setToOpen(false), 120)}
              onChange={(event) => {
                setForm((prev) => ({ ...prev, to: event.target.value }))
                setToActiveIndex(0)
              }}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown' && toSuggestions.length) {
                  event.preventDefault()
                  setToActiveIndex((prev) => (prev + 1) % toSuggestions.length)
                }
                if (event.key === 'ArrowUp' && toSuggestions.length) {
                  event.preventDefault()
                  setToActiveIndex((prev) => (prev <= 0 ? toSuggestions.length - 1 : prev - 1))
                }
                if (event.key === 'Enter' && toSuggestions[toActiveIndex]) {
                  event.preventDefault()
                  selectToSuggestion(toSuggestions[toActiveIndex])
                }
              }}
              className="input-surface w-full"
              placeholder="Destination"
            />
            <AnimatePresence>
              {toOpen && (toLoading || toSuggestions.length || toError) && (
                <Motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-orange-100 bg-white shadow-card dark:border-slate-700 dark:bg-darkcard"
                >
                  {toLoading ? (
                    <p className="px-3 py-2 text-xs text-slate-500 dark:text-slate-300">Loading suggestions...</p>
                  ) : toSuggestions.length ? (
                    toSuggestions.map((item, index) => (
                      <button
                        key={item.id || item.label}
                        type="button"
                        onMouseDown={() => selectToSuggestion(item)}
                        className={`block w-full px-3 py-2 text-left text-xs transition-colors ${
                          index === toActiveIndex
                            ? 'bg-orange-100 text-primary dark:bg-slate-700 dark:text-accent'
                            : 'text-slate-700 hover:bg-orange-50 dark:text-slate-200 dark:hover:bg-slate-800'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-xs text-slate-500 dark:text-slate-300">{toError}</p>
                  )}
                </Motion.div>
              )}
            </AnimatePresence>
          </div>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-200">{t('common.tripDuration')}</span>
          <select
            value={form.durationMode === 'custom' ? 'custom' : form.duration}
            onChange={(event) => {
              const value = event.target.value
              if (value === 'custom') {
                setForm((prev) => ({ ...prev, durationMode: 'custom', duration: prev.customDuration }))
                return
              }
              setForm((prev) => ({
                ...prev,
                durationMode: 'preset',
                duration: value,
                customDuration: `${value} days`,
              }))
            }}
            className="input-surface w-full"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <option key={day} value={day}>
                {day} days
              </option>
            ))}
            <option value="custom">Custom</option>
          </select>
          <AnimatePresence initial={false}>
            {form.durationMode === 'custom' && (
              <Motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="space-y-2"
              >
                <select
                  value={parsedCustomDurationDays}
                  onChange={(event) => {
                    const next = `${event.target.value} days`
                    setForm((prev) => ({ ...prev, customDuration: next, duration: next }))
                  }}
                  className="input-surface w-full"
                >
                  {Array.from({ length: 30 }, (_, index) => index + 1).map((day) => (
                    <option key={day} value={day}>
                      {day} day{day > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
                <input
                  value={form.customDuration}
                  onChange={(event) => {
                    const next = event.target.value
                    setForm((prev) => ({ ...prev, customDuration: next, duration: next }))
                  }}
                  className="input-surface w-full"
                  placeholder="e.g. 45 days"
                />
              </Motion.div>
            )}
          </AnimatePresence>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-200">{t('common.budget')}</span>
          <input
            type="range"
            min={1000}
            max={500000}
            step={1000}
            value={Number(form.budget) > 0 ? Number(form.budget) : 1000}
            onChange={(event) => setForm((prev) => ({ ...prev, budget: event.target.value }))}
            className="w-full accent-orange-500 dark:accent-accent"
          />
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 dark:text-slate-300">
              ₹
            </span>
            <input
              type="number"
              min={1}
              step={1}
              value={form.budget}
              onChange={(event) => setForm((prev) => ({ ...prev, budget: event.target.value }))}
              className="input-surface w-full pl-8"
              placeholder="50000"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[25000, 50000, 100000, 200000].map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, budget: String(amount) }))}
                className="rounded-full border border-orange-200 bg-orange-50 px-2 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-orange-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)}
              </button>
            ))}
          </div>
          {formattedBudget && (
            <p className="text-xs font-semibold text-primary dark:text-accent">Selected budget: {formattedBudget}</p>
          )}
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-200">{t('common.travelers')}</span>
          <select
            value={form.members}
            onChange={(event) => setForm((prev) => ({ ...prev, members: event.target.value }))}
            className="input-surface w-full transition-all duration-200"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
            <option value="custom">Custom</option>
          </select>
          <AnimatePresence initial={false}>
            {form.members === 'custom' && (
              <Motion.input
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                type="number"
                min={1}
                max={50}
                value={form.customMembers}
                onChange={(event) => setForm((prev) => ({ ...prev, customMembers: event.target.value }))}
                className="input-surface w-full"
                placeholder="Enter travelers (1-50)"
              />
            )}
          </AnimatePresence>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-200">{t('common.travelType')}</span>
          <select
            value={form.travelType}
            
            onChange={(event) => setForm((prev) => ({ ...prev, travelType: event.target.value }))}
            className="input-surface w-full"
          >
            {['Solo', 'Couple', 'Family', 'Friends'].map((type) => (
      
              <option key={type} value={type}>
                {type}
              </option>
            ))}
            
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-200">{t('common.travelStyle')}</span>
          <select
            value={form.travelStyle}
            onChange={(event) => setForm((prev) => ({ ...prev, travelStyle: event.target.value }))}
            className="input-surface w-full"
          >
            {['Culture', 'Nature', 'Adventure', 'Food'].map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </label>
      </div>
      {validationError && <p className="text-sm text-rose-500">{validationError}</p>}
      <button className="btn-gradient text-sm">
        {t('common.generatePlan')}
      </button>
    </form>
  )
}

export default TripPlannerForm
