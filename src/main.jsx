import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { I18nProvider } from './utils/I18nContext'
import { ThemeProvider } from './utils/ThemeContext'
import { TravelDataProvider } from './utils/TravelDataContext'
import { TravelProvider } from './utils/TravelContext'
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import "leaflet-defaulticon-compatibility"
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <I18nProvider>
          <TravelDataProvider>
            <TravelProvider>
              <App />
            </TravelProvider>
          </TravelDataProvider>
        </I18nProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
