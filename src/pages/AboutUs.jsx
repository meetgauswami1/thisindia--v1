function AboutUs() {
  const offerings = [
    'AI Trip Planner',
    'Weather insights',
    'Hotel and flight search',
    'Crowd Predictor',
    'Hidden gems discovery',
    'Interactive maps',
    'Multilingual support',
  ]

  const users = [
    'Solo travelers',
    'Families planning flexible vacations',
    'Budget travelers',
    'Cultural explorers across India',
  ]

  return (
    <section className="space-y-6">
      <header>
        <h1 className="heading-text text-3xl">About ThisIndia</h1>
        <p className="muted-text mt-1 text-sm">Discover the Real India</p>
      </header>

      <div className="card-surface space-y-5 p-5 md:p-6">
        <div className="space-y-2">
          <h2 className="heading-text text-2xl">Project Name</h2>
          <p className="muted-text text-sm">ThisIndia - Discover the Real India</p>
        </div>

        <div className="space-y-2">
          <h2 className="heading-text text-2xl">Our Motive</h2>
          <p className="muted-text text-sm">
            ThisIndia helps travelers discover authentic, lesser-known destinations across India beyond the usual tourist circuit.
            The goal is to highlight places where culture, local communities, and meaningful experiences come first.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="heading-text text-2xl">What ThisIndia Offers</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {offerings.map((item) => (
              <p key={item} className="card-soft px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                {item}
              </p>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="heading-text text-2xl">Problem We Solve</h2>
          <p className="muted-text text-sm">
            Many tourists miss real local culture, hidden gems, and budget-friendly options because mainstream travel tools focus
            heavily on overexposed locations. ThisIndia bridges that gap by combining AI planning and real-time data so travelers
            can explore India more deeply and confidently.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="heading-text text-2xl">Who We Build For</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {users.map((item) => (
              <p key={item} className="card-soft px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                {item}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-sunset-gradient p-[1px]">
          <div className="rounded-2xl bg-white p-4 dark:bg-darkcard">
            <h2 className="heading-text text-2xl">Our Vision</h2>
            <p className="muted-text mt-2 text-sm">
              Make every corner of India accessible, discoverable, and enjoyable for every kind of traveler.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs
