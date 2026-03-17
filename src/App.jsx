import { AnimatePresence, motion as Motion } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import AIChatAssistant from './components/AIChatAssistant'
import BottomNavigation from './components/BottomNavigation'
import Footer from './components/Footer'
import MobileNavbar from './components/MobileNavbar'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import AIAssistant from './pages/AIAssistant'
import AboutUs from './pages/AboutUs'
import DestinationDetails from './pages/DestinationDetails'
import Explore from './pages/Explore'
import Home from './pages/Home'
import MapExplorerPage from './pages/MapExplorerPage'
import SavedTripsPage from './pages/SavedTripsPage'
import TripPlanner from './pages/TripPlanner'
import { useTravelData } from './utils/TravelDataContext'

function App() {
  const location = useLocation()
  const { loadingState } = useTravelData()
  const isDataLoading = loadingState.searchingLocation || loadingState.fetchingData

  return (
    <div className="app-surface min-h-screen">
      <ScrollToTop />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-[2px] bg-transparent">
        <AnimatePresence mode="wait" initial={false}>
          <Motion.div
            key={location.pathname}
            initial={{ width: '0%', opacity: 0.9 }}
            animate={{ width: '100%', opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="absolute left-0 top-0 h-full bg-sunset-gradient shadow-glow"
          />
        </AnimatePresence>
        {isDataLoading && (
          <Motion.div
            initial={{ x: '-70%', opacity: 0.9 }}
            animate={{ x: '100%', opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 1, ease: 'linear', repeat: Number.POSITIVE_INFINITY }}
            className="absolute top-0 h-full w-[70%] bg-sunset-gradient shadow-glow"
          />
        )}
      </div>
      <MobileNavbar />
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-5 md:px-6 md:pb-10 md:pt-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/trip-planner" element={<TripPlanner />} />
          <Route path="/destination/:id" element={<DestinationDetails />} />
          <Route path="/map-explorer" element={<MapExplorerPage />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/saved-trips" element={<SavedTripsPage />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </main>
      <Footer />
      <BottomNavigation />
      <AIChatAssistant />
    </div>
  )
}

export default App
