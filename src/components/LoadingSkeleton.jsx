function LoadingSkeleton({ lines = 3 }) {
  return (
    <div className="card-surface space-y-2 p-4">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 animate-pulse rounded bg-orange-100 dark:bg-slate-700 ${index === 0 ? 'w-3/4' : index === lines - 1 ? 'w-1/2' : 'w-full'}`}
        />
      ))}
    </div>
  )
}

export default LoadingSkeleton
