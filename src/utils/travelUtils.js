import { jsPDF } from 'jspdf'

export const getHiddenGemScore = (popularity, uniqueness) => {
  const score = Math.round(uniqueness * 0.65 + (100 - popularity) * 0.35)
  return Math.max(50, Math.min(100, score))
}

export const getScoreCategory = (score) => {
  if (score >= 90) return 'Rare Hidden Gem'
  if (score >= 70) return 'Underrated Destination'
  return 'Popular Spot'
}

export const getCrowdPrediction = ({ dayOfWeek, weather, popularity }) => {
  const weekend = dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday'
  const rainy = weather.rainProbability.includes('4') || weather.rainProbability.includes('5')
  const base = popularity + (weekend ? 15 : 0) - (rainy ? 8 : 0)
  if (base < 45) {
    return { level: 'Peaceful', bestTime: '7 AM – 10 AM' }
  }
  if (base < 70) {
    return { level: 'Moderate', bestTime: '7 AM – 9 AM' }
  }
  return { level: 'Crowded', bestTime: '6 AM – 8 AM' }
}

export const generateItinerary = ({
  destination,
  from,
  to,
  duration,
  budget,
  travelers,
  travelStyle,
  travelType,
}) => {
  const dest = to || destination
  const days = Number(duration)
  const destinationKey = (dest || '').toLowerCase()
  const travelerCount = Number(travelers)

  const locationHighlights = destinationKey.includes('goa')
    ? ['Beach exploration at sunrise', 'Water sports and coastal adventure', 'Sunset viewpoints and local nightlife', 'Goan seafood and local market walk', 'Heritage churches and cultural spots']
    : destinationKey.includes('kerala') || destinationKey.includes('kuttanad')
      ? ['Backwater village canoe ride', 'Local spice and seafood tasting', 'Birdwatching and paddy trail', 'Sunset houseboat experience', 'Traditional art and temple visit']
      : destinationKey.includes('gujarat') || destinationKey.includes('patan')
        ? ['Stepwell and heritage architecture tour', 'Patola weaving and craft cluster visit', 'Street food and bazaar trail', 'Evening cultural storytelling walk', 'Nearby historical monument circuit']
        : destinationKey.includes('himachal') || destinationKey.includes('tirthan')
          ? ['Mountain village trail and riverside walk', 'Adventure activity and nature photography', 'Local homestay food experience', 'Forest viewpoint trek', 'Campfire and folk culture evening']
          : ['Local landmark exploration', 'Hidden gem neighborhood walk', 'Regional food and market experience', 'Sunset viewpoint and leisure time', 'Culture-focused evening activity']

  const budgetBand = Number.isFinite(Number(budget))
    ? Number(budget) >= 100000
      ? 'premium'
      : Number(budget) >= 50000
        ? 'comfort'
        : 'value'
    : 'comfort'

  const groupContext = Number.isFinite(travelerCount) && travelerCount > 1
    ? `${travelerCount} travelers`
    : `${travelType.toLowerCase()} traveler`

  const itinerary = Array.from({ length: days }, (_, index) => ({
    day: index + 1,
    title: `Day ${index + 1} • ${travelStyle} Experience`,
    activities: [
      `${locationHighlights[index % locationHighlights.length]} in ${dest}`,
      `${travelStyle} activity curated for ${groupContext}`,
      `${budgetBand === 'premium' ? 'Premium' : budgetBand === 'value' ? 'Budget-smart' : 'Balanced'} experience planning with local authenticity`,
      `Evening food and culture walk with destination-specific recommendations`,
    ],
  }))

  const seasonalGuide = travelStyle === 'Nature' ? 'Oct to Mar' : travelStyle === 'Adventure' ? 'Mar to Jun' : 'Nov to Feb'
  const budgetValue = Number(budget)
  const budgetText = Number.isFinite(budgetValue) && budgetValue > 0
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(budgetValue)
    : budget === 'Low'
      ? '₹18,000 - ₹28,000'
      : budget === 'Medium'
        ? '₹30,000 - ₹55,000'
        : '₹60,000+'

  return {
    summary: {
      route: from && dest ? `${from} → ${dest}` : dest,
      destination: dest,
      duration: `${days} Day${days > 1 ? 's' : ''}`,
      estimatedBudget: budgetText,
      travelers: Number.isFinite(travelerCount) && travelerCount > 0 ? `${travelerCount}` : undefined,
      bestSeason: seasonalGuide,
    },
    itinerary,
  }
}

export const downloadTripGuidePdf = (tripData) => {
  const doc = new jsPDF()
  doc.setFontSize(18)
  doc.text('ThisIndia Travel Guide', 20, 20)
  doc.setFontSize(12)
  doc.text(`Destination: ${tripData.summary.destination}`, 20, 34)
  doc.text(`Duration: ${tripData.summary.duration}`, 20, 42)
  doc.text(`Budget: ${tripData.summary.estimatedBudget}`, 20, 50)
  doc.text(`Best Season: ${tripData.summary.bestSeason}`, 20, 58)

  let y = 72
  tripData.itinerary.forEach((day) => {
    doc.setFontSize(13)
    doc.text(day.title, 20, y)
    y += 8
    doc.setFontSize(11)
    day.activities.forEach((activity) => {
      doc.text(`• ${activity}`, 24, y)
      y += 7
      if (y > 270) {
        doc.addPage()
        y = 20
      }
    })
    y += 5
  })

  doc.save(`${tripData.summary.destination.replaceAll(' ', '_')}_travel_guide.pdf`)
}
