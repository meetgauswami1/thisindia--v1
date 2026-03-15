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
  travelStyle,
  travelType,
}) => {
  const dest = to || destination
  const days = Number(duration)
  const itinerary = Array.from({ length: days }, (_, index) => ({
    day: index + 1,
    title: `Day ${index + 1} • ${travelStyle} Experience`,
    activities: [
      `Explore local highlights around ${dest}`,
      `Curated ${travelStyle.toLowerCase()} activity for ${travelType.toLowerCase()} travelers`,
      `Evening food and culture walk`,
    ],
  }))

  const seasonalGuide = travelStyle === 'Nature' ? 'Oct to Mar' : travelStyle === 'Adventure' ? 'Mar to Jun' : 'Nov to Feb'
  const budgetText =
    budget === 'Low' ? '₹18,000 - ₹28,000' : budget === 'Medium' ? '₹30,000 - ₹55,000' : '₹60,000+'

  return {
    summary: {
      route: from && dest ? `${from} → ${dest}` : dest,
      destination: dest,
      duration: `${days} Day${days > 1 ? 's' : ''}`,
      estimatedBudget: budgetText,
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
