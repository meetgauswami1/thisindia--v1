import { useTravelData } from '../utils/TravelDataContext'

function WeatherWidget() {
  const { travelData, loadingState, errors } = useTravelData()
  const weather = travelData.weather
  

  return (
    <section className="space-y-4">
      <h2 className="heading-text text-2xl">Weather Information</h2>
      {loadingState.fetchingData ? (
        <div className="card-surface p-4 text-sm text-slate-500 dark:text-slate-300">Loading weather...</div>
      ) : errors.weather ? (
        <div className="card-surface p-4 text-sm text-rose-500">{errors.weather}</div>
      ) : !weather ? (
        <div className="card-surface p-4 text-sm text-slate-500 dark:text-slate-300">No weather data available.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <article className="card-surface p-5">
            <h3 className="heading-text text-lg">Current Weather</h3>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="card-soft p-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">Temperature</p>
                <p className="font-semibold">{Math.round(weather.current.temperature)}°C</p>
              </div>
              <div className="card-soft p-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">Condition</p>
                <p className="font-semibold">{weather.current.condition}</p>
              </div>
              <div className="card-soft p-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">Humidity</p>
                <p className="font-semibold">{weather.current.humidity}%</p>
              </div>
              <div className="card-soft p-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">Wind</p>
                <p className="font-semibold">{weather.current.windSpeed} m/s</p>
              </div>
            </div>
          </article>
          <article className="card-surface p-5">
            <h3 className="heading-text text-lg">5 Day Forecast</h3>
            <div className="mt-3 space-y-2">
              {weather.forecast.map((day) => (
                <div key={day.date} className="card-soft flex items-center justify-between p-3 text-sm">
                  <span>{day.date}</span>
                  <span>{day.condition}</span>
                  <span className="font-semibold">{Math.round(day.temperature)}°C</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      )}
    </section>
  )
}

export default WeatherWidget
