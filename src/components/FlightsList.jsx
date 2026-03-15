import { useTravelData } from '../utils/TravelDataContext'

function FlightsList() {
  const { travelData, loadingState, errors } = useTravelData()
  const flights = travelData.flights || []

  return (
    <section className="space-y-4">
      <h2 className="heading-text text-2xl">Flight Search</h2>
      {loadingState.fetchingData ? (
        <div className="card-surface p-4 text-sm text-slate-500 dark:text-slate-300">Searching flights...</div>
      ) : errors.flights ? (
        <div className="card-surface p-4 text-sm text-rose-500">{errors.flights}</div>
      ) : !flights.length ? (
        <div className="card-surface p-4 text-sm text-slate-500 dark:text-slate-300">No flights available for this route right now.</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {flights.map((flight) => (
            <article key={flight.id} className="card-surface p-4">
              <h3 className="font-semibold text-secondary dark:text-orange-300">{flight.airline}</h3>
              <div className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                <p>Departure: {flight.departure || 'N/A'}</p>
                <p>Arrival: {flight.arrival || 'N/A'}</p>
              </div>
              <p className="mt-2 text-lg font-bold text-primary">
                {flight.currency} {flight.price}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default FlightsList
