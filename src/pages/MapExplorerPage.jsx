import { useState } from 'react'
import MapExplorer from '../components/MapExplorer'
import { useI18n } from '../utils/I18nContext'

function MapExplorerPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const { t } = useI18n()

  return (
    <section className="space-y-6">
      <header>
        <h1 className="heading-text text-3xl">{t('pages.mapExplorerTitle')}</h1>
        <p className="muted-text mt-1 text-sm">
          Explore destinations on an interactive map with markers, filters, zoom-ready area, and popup-ready cards.
        </p>
      </header>
      <MapExplorer activeFilter={activeFilter} onFilterChange={setActiveFilter} />
    </section>
  )
}

export default MapExplorerPage
