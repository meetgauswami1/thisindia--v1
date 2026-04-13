import { useState } from 'react'
import { useI18n } from '../utils/I18nContext'
import { destinations } from '../utils/destinationsData'
import { color } from 'framer-motion'

function MapExplorerPage() {
  const { t } = useI18n()
  const [activeTopic, setActiveTopic] = useState('Culture')
  const topicMap = {
    Culture: ['Traditional arts', 'Festivals and rituals', 'UNESCO heritage', 'Regional cuisines'],
    Nature: ['Mountain ecosystems', 'Wetland villages', 'Forest trails', 'River islands'],
    Adventure: ['Trekking circuits', 'Kayaking rivers', 'Rural biking routes', 'Camping pockets'],
    Rural: ['Farm stays', 'Village storytelling', 'Handloom clusters', 'Community markets'],
  }
  const hiddenPicks = [...destinations]
    .sort((a, b) => a.popularity - b.popularity || b.uniqueness - a.uniqueness)
    .slice(0, 4)

  return (
    <section className="space-y-6">
      <header>
        <h1 className="heading-text text-3xl">{t('pages.mapExplorerTitle')}</h1>
        <p className="muted-text mt-1 text-sm">Interactive India tourism insights with culture-first and hidden-destination highlights.</p>
      </header>
      <div className="card-surface space-y-3 overflow-hidden p-5 md:p-6">
        <h2 className="heading-text text-2xl">Discover BHARAT With Us</h2>
        <p className="muted-text max-w-3xl text-sm">
          Explore India-centric travel narratives, from hidden valleys and river islands to living heritage towns and cultural trails.
        </p>
        <div className="grid gap-2 md:grid-cols-3">
          <div className="card-soft p-3 text-sm">
            <p className="font-semibold text-secondary dark:text-orange-300">Cultural diversity</p>
            <p className="muted-text mt-1 text-xs">22+ scheduled languages, hundreds of traditions, and deeply local travel stories.</p>
          </div>
          <div className="card-soft p-3 text-sm">
            <p className="font-semibold text-secondary dark:text-orange-300">Rural tourism</p>
            <p className="muted-text mt-1 text-xs">Community-run stays and craft villages create meaningful local impact.</p>
          </div>
          <div className="card-soft p-3 text-sm">
            <p className="font-semibold text-secondary dark:text-orange-300">Interactive map layers</p>
            <p className="muted-text mt-1 text-xs">Use map topics below to uncover themed picks across nature, culture, and adventure.</p>
          </div>
        </div>
      </div>

      <div className="card-surface space-y-4 p-5 md:p-6">
        <div className="flex flex-wrap gap-2">
          {Object.keys(topicMap).map((topic) => (
            <button
              key={topic}
              onClick={() => setActiveTopic(topic)}
              className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                activeTopic === topic
                  ? 'bg-sunset-gradient text-white'
                  : 'bg-orange-100 text-orange-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {topicMap[activeTopic].map((item) => (
            <article key={item} className="card-soft p-4 text-sm">
              <h3 className="font-semibold text-secondary dark:text-orange-300">{item}</h3>
              <p className="muted-text mt-1">
                Discover centuries-old crafts and living art forms that have shaped India's cultural identity across generations and regions.
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="heading-text text-2xl">Hidden India Editorial Picks</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {hiddenPicks.map((item) => (
            <article key={item.id} className="card-surface overflow-hidden">
              <img
                src={item.heroImage || item.image}
                alt={item.name}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.src = `https://source.unsplash.com/1200x800/?${encodeURIComponent(`${item.name}, ${item.state}, india`)}`.replaceAll('%20', '+')
                }}
                className="h-40 w-full object-cover"
              />
              <div className="space-y-2 p-4">
                <p className="text-sm font-bold text-secondary dark:text-orange-300">{item.name}</p>
                <p className="muted-text text-xs">{item.description}</p>
                <p className="text-xs font-semibold text-primary dark:text-accent">{item.state} · {item.category}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MapExplorerPage
