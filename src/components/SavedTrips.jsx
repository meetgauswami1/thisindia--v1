function SavedTrips({ trips, onDelete }) {
  if (!trips.length) {
    return (
      <div className="card-surface border-dashed p-8 text-center text-slate-500 dark:text-slate-300">
        No saved trips yet. Generate an itinerary and save it to view here.
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {trips.map((trip) => (
        <article key={trip.id} className="card-surface p-5">
          <h3 className="text-lg font-bold text-secondary dark:text-orange-300">{trip.tripName}</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Destination: {trip.destination}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">Duration: {trip.duration}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">Date saved: {trip.dateSaved}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">Itinerary days: {trip.itinerary?.length || 0}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">Generated: {trip.travelDates?.generatedOn ? new Date(trip.travelDates.generatedOn).toLocaleString() : 'N/A'}</p>
          <div className="mt-4 flex gap-2">
            <button className="btn-gradient px-3 py-1 text-xs">Saved</button>
            <button
              onClick={() => onDelete(trip.id)}
              className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-400/20 dark:text-rose-300"
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

export default SavedTrips
