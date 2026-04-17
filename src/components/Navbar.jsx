import { AnimatePresence, motion as Motion } from 'framer-motion'
import { FiMoon, FiSun } from 'react-icons/fi'
import { Link, NavLink } from 'react-router-dom'
import { useI18n } from '../utils/I18nContext'
import { useTheme } from '../utils/ThemeContext'
import SearchBar from './SearchBar'

const navLinks = [
  { labelKey: 'nav.home', path: '/' },
  // { labelKey: 'nav.hiddenGems', path: '/hidden-gems' },
  { labelKey: 'nav.tripPlanner', path: '/trip-planner' },
  { labelKey: 'nav.mapExplorer', path: '/map-explorer' },
  { labelKey: 'nav.aiAssistant', path: '/ai-assistant' },
  { labelKey: 'nav.savedTrips', path: '/saved-trips' },
]

const baseLinkClass = 'text-xs font-medium transition-all duration-200 hover:text-primary dark:hover:text-accent xl:text-sm relative pb-1'

function Navbar() {
  const { isDark, toggleTheme } = useTheme()
  const { t, language, setLanguage, languageOptions } = useI18n()

  return (
    <header className="glass-nav sticky top-0 z-40 hidden md:block">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-6 py-4">
        <Link to="/" className="shrink-0 text-2xl font-bold text-secondary transition-colors duration-300 dark:text-orange-300">
          ThisIndia
        </Link>
        <div className="flex-1">
          <SearchBar className="mx-auto w-full max-w-md" mode="compact" />
        </div>
        <nav className="hidden items-center gap-4 text-slate-700 dark:text-slate-200 xl:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `${baseLinkClass} ${
                  isActive
                    ? 'text-primary dark:text-accent after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-orange-500 after:rounded-full'
                    : 'text-slate-700 dark:text-slate-200'
                }`
              }
            >
              {t(link.labelKey)}
            </NavLink>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2 lg:gap-3">
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            aria-label={t('nav.language')}
            className="input-surface w-[128px] text-xs"
          >
            {languageOptions.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-200 bg-white text-slate-700 transition-all duration-300 hover:scale-105 dark:border-slate-600 dark:bg-slate-900 dark:text-orange-300"
            aria-label="Toggle color theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              <Motion.span
                key={isDark ? 'sun' : 'moon'}
                initial={{ opacity: 0, rotate: -40, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 40, scale: 0.8 }}
                transition={{ duration: 0.25 }}
              >
                {isDark ? <FiSun /> : <FiMoon />}
              </Motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar