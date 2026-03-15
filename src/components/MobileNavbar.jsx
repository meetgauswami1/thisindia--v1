import { AnimatePresence, motion as Motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { FiMenu, FiMoon, FiSearch, FiSun, FiX } from 'react-icons/fi'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useI18n } from '../utils/I18nContext'
import { useTheme } from '../utils/ThemeContext'
import SearchBar from './SearchBar'

const navLinks = [
  { labelKey: 'nav.home', path: '/' },
  { labelKey: 'nav.explore', path: '/explore' },
  { labelKey: 'nav.tripPlanner', path: '/trip-planner' },
  { labelKey: 'nav.mapExplorer', path: '/map-explorer' },
  { labelKey: 'nav.aiAssistant', path: '/ai-assistant' },
  { labelKey: 'nav.savedTrips', path: '/saved-trips' },
]

function MobileNavbar() {
  const [showSearch, setShowSearch] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()
  const { t, language, setLanguage, languageOptions } = useI18n()

  const pageTitle = useMemo(() => {
    const found = navLinks.find((item) => item.path === location.pathname)
    return found ? t(found.labelKey) : 'ThisIndia'
  }, [location.pathname, t])

  return (
    <header className="glass-nav sticky top-0 z-50 px-4 py-3 md:hidden">
      <div className="flex items-center justify-between gap-3 overflow-visible">
        <Link to="/" className="min-w-0 shrink-0 overflow-visible text-xl font-bold leading-none text-secondary dark:text-orange-300">
          ThisIndia
        </Link>
        {!showSearch && (
          <p className="truncate px-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            {pageTitle}
          </p>
        )}
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-200 bg-white text-slate-700 transition-all duration-300 dark:border-slate-600 dark:bg-slate-900 dark:text-orange-300"
            aria-label="Toggle color theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              <Motion.span
                key={isDark ? 'sun' : 'moon'}
                initial={{ opacity: 0, rotate: -35, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 35, scale: 0.8 }}
                transition={{ duration: 0.25 }}
              >
                {isDark ? <FiSun /> : <FiMoon />}
              </Motion.span>
            </AnimatePresence>
          </button>
          <button
            onClick={() => {
              setShowSearch((prev) => !prev)
              setShowMenu(false)
            }}
            className="rounded-full border border-orange-200 bg-white p-2 text-slate-700 transition-colors duration-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            aria-label="Search locations"
          >
            {showSearch ? <FiX /> : <FiSearch />}
          </button>
          <button
            onClick={() => {
              setShowMenu((prev) => !prev)
              setShowSearch(false)
            }}
            className="rounded-full border border-orange-200 bg-white p-2 text-slate-700 transition-colors duration-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            aria-label="Open menu"
          >
            {showMenu ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="mt-3">
          <SearchBar
            className="w-full"
            autoFocus
            mode="compact"
            placeholder="Search destinations in India"
            onSelected={() => setShowSearch(false)}
          />
        </div>
      )}

      {showMenu && (
        <nav className="card-surface mt-3 p-2">
          <div className="mb-2 rounded-xl border border-orange-100 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
            <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-300">{t('nav.language')}</label>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="input-surface w-full text-sm"
            >
              {languageOptions.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setShowMenu(false)}
              className={({ isActive }) =>
                `block rounded-xl px-3 py-2 text-sm font-semibold ${
                  isActive ? 'bg-primary/10 text-primary dark:bg-accent/20 dark:text-accent' : 'text-slate-700 dark:text-slate-200'
                }`
              }
            >
              {t(link.labelKey)}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}

export default MobileNavbar
