function CrowdPredictorCard({ crowd }) {
  const tone =
    crowd.level === 'Peaceful'
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-300'
      : crowd.level === 'Moderate'
        ? 'bg-amber-100 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300'
        : 'bg-rose-100 text-rose-700 dark:bg-rose-400/20 dark:text-rose-300'

  return (
    <article className="card-surface p-5">
      <h4 className="heading-text mb-4 text-lg">Crowd Predictor</h4>
      <div className="space-y-3 text-sm">
        <p className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${tone}`}>Crowd Level: {crowd.level}</p>
        <div className="card-soft p-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">Best Time to Visit</p>
          <p className="font-semibold text-slate-700 dark:text-slate-100">{crowd.bestTime}</p>
        </div>
      </div>
    </article>
  )
}

export default CrowdPredictorCard
