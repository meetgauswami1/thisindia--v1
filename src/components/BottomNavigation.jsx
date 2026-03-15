import { HiMiniMapPin, HiOutlineMap, HiOutlineSparkles } from 'react-icons/hi2'
import { IoHomeOutline } from 'react-icons/io5'
import { MdOutlineBookmarkBorder } from 'react-icons/md'
import { NavLink } from 'react-router-dom'
import { useI18n } from '../utils/I18nContext'

const tabs = [
  { labelKey: 'nav.home', path: '/', icon: IoHomeOutline },
  { labelKey: 'nav.explore', path: '/explore', icon: HiMiniMapPin },
  { labelKey: 'nav.mapExplorer', path: '/map-explorer', icon: HiOutlineMap },
  { labelKey: 'nav.aiAssistant', path: '/ai-assistant', icon: HiOutlineSparkles },
  { labelKey: 'nav.savedTrips', path: '/saved-trips', icon: MdOutlineBookmarkBorder },
]

function BottomNavigation() {
  const { t } = useI18n()

  return (
    <nav className="glass-nav fixed bottom-3 left-1/2 z-50 w-[94%] -translate-x-1/2 rounded-2xl p-2 md:hidden">
      <ul className="flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <li key={tab.path}>
              <NavLink
                to={tab.path}
                className={({ isActive }) =>
                  `flex min-w-14 flex-col items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-semibold transition ${
                    isActive
                      ? 'bg-primary/10 text-primary dark:bg-accent/20 dark:text-accent'
                      : 'text-slate-500 dark:text-slate-300'
                  }`
                }
              >
                <Icon className="text-lg" />
                {t(tab.labelKey)}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default BottomNavigation
