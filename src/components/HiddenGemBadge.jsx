import { getScoreCategory } from '../utils/travelUtils'

function HiddenGemBadge({ score }) {
  const category = getScoreCategory(score)
  const tone =
    score >= 90
      ? 'bg-gradient-to-r from-orange-400 to-yellow-300 text-slate-900'
      : score >= 70
        ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300'
        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300'

  return (
    <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold shadow-sm ${tone}`}>
      🔥 Hidden Gem Score: {score} • {category}
    </div>
  )
}

export default HiddenGemBadge
