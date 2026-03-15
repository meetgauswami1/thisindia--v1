import { useI18n } from '../utils/I18nContext'

function AIAssistant() {
  const { t } = useI18n()

  return (
    <section className="space-y-6">
      <header>
        <h1 className="heading-text text-3xl">{t('pages.aiAssistantTitle')}</h1>
        <p className="muted-text mt-1 text-sm">Chat with your travel co-pilot for hidden gems, weather-smart suggestions, and itinerary ideas.</p>
      </header>
      <div className="card-surface p-6">
        <h3 className="heading-text text-xl">Try prompts</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            'Suggest hidden places in Gujarat',
            '3 day trip for Rajasthan',
            'Best winter destinations in India',
          ].map((prompt) => (
            <span key={prompt} className="chip-surface px-3 py-2 text-sm">
              {prompt}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AIAssistant
