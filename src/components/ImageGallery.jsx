import { useState } from 'react'
import { FiX } from 'react-icons/fi'
import { useTravelData } from '../utils/TravelDataContext'

function ImageGallery() {
  const { travelData, loadingState, errors } = useTravelData()
  const [preview, setPreview] = useState(null)
  const images = travelData.images || []
  const fallbackImage = 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80'

  return (
    <section className="space-y-4">
      <h2 className="heading-text text-2xl">Destination Image Gallery</h2>
      {loadingState.fetchingData ? (
        <div className="card-surface p-4 text-sm text-slate-500 dark:text-slate-300">Loading gallery...</div>
      ) : errors.images ? (
        <div className="card-surface p-4 text-sm text-rose-500">{errors.images}</div>
      ) : !images.length ? (
        <div className="card-surface p-4 text-sm text-slate-500 dark:text-slate-300">No images available for this destination.</div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {images.map((image) => (
            <button key={image.id} onClick={() => setPreview(image)} className="overflow-hidden rounded-xl">
              <img
                src={image.thumb}
                alt={image.alt}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.src = fallbackImage
                }}
                className="h-28 w-full object-cover transition-transform duration-300 hover:scale-105 md:h-32"
              />
            </button>
          ))}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4">
          <div className="relative max-w-4xl overflow-hidden rounded-2xl bg-white p-2 dark:bg-darkcard">
            <button onClick={() => setPreview(null)} className="absolute right-3 top-3 rounded-full bg-black/50 p-1 text-white">
              <FiX />
            </button>
            <img
              src={preview.url}
              alt={preview.alt}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.onerror = null
                event.currentTarget.src = fallbackImage
              }}
              className="max-h-[78vh] w-full object-contain"
            />
          </div>
        </div>
      )}
    </section>
  )
}

export default ImageGallery
