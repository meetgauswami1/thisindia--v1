function WeatherCard({ weather }) {
  return (
    <article className="card-surface p-5">
      <h4 className="heading-text mb-4 text-lg">Weather Predictor</h4>
      <div className="grid grid-cols-2 gap-3 text-sm text-slate-700 dark:text-slate-200">
        <div className="card-soft p-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">Temperature</p>
          <p className="font-semibold">{weather.temp}</p>
        </div>
        <div className="card-soft p-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">Rain Probability</p>
          <p className="font-semibold">{weather.rainProbability}</p>
        </div>
        <div className="card-soft p-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">Best Season</p>
          <p className="font-semibold">{weather.bestSeason}</p>
        </div>
        <div className="card-soft p-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">Travel Comfort</p>
          <p className="font-semibold">{weather.comfort}</p>
        </div>
      </div>
    </article>
  )
}

export default WeatherCard
