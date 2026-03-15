function ItineraryCard({ day }) {
  return (
    <article className="card-surface p-4">
      <h4 className="mb-3 text-base font-bold text-secondary dark:text-orange-300">{day.title}</h4>
      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
        {day.activities.map((activity) => (
          <li key={activity} className="card-soft px-3 py-2">
            {activity}
          </li>
        ))}
      </ul>
    </article>
  )
}

export default ItineraryCard
