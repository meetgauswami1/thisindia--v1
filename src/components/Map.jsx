import { useEffect, useMemo } from "react"
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet"
import { useTravelData } from "../utils/TravelDataContext"
import L from "leaflet"

const defaultCenter = [20.5937, 78.9629]

const hotelIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [32, 32],
})

const restaurantIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
})

const attractionIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
})

function Map({ onMarkerSelect }) {
  const { selectedLocation, travelData, loadingState } = useTravelData()

  const center = useMemo(() => {
    if (!selectedLocation) return defaultCenter
    return [selectedLocation.lat, selectedLocation.lng]
  }, [selectedLocation])

  const mapMarkers = useMemo(
    () => [
      ...(travelData.attractions || []).map((item) => ({
        ...item,
        markerType: "attraction",
      })),
      ...(travelData.hotels || []).map((item) => ({
        ...item,
        markerType: "hotel",
      })),
      ...(travelData.restaurants || []).map((item) => ({
        ...item,
        markerType: "restaurant",
      })),
    ],
    [travelData]
  )

  const getIcon = (type) => {
    if (type === "hotel") return hotelIcon
    if (type === "restaurant") return restaurantIcon
    return attractionIcon
  }

  function MapViewportUpdater({ centerPoint, zoomLevel }) {
    const map = useMap()

    useEffect(() => {
      map.setView(centerPoint, zoomLevel, { animate: true, duration: 1 })
    }, [map, centerPoint, zoomLevel])

    return null
  }

  return (
    <div className="card-surface overflow-hidden p-2">
      <MapContainer
        center={center}
        zoom={selectedLocation ? 12 : 4}
        style={{ width: "100%", height: "420px" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewportUpdater centerPoint={center} zoomLevel={selectedLocation ? 12 : 4} />

        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
            <Popup>{selectedLocation.label}</Popup>
          </Marker>
        )}

        {!loadingState.fetchingData && mapMarkers.map((item) => (
          <Marker
            key={item.id}
            position={[item.location.lat, item.location.lng]}
            icon={getIcon(item.markerType)}
            eventHandlers={{
              click: () => {
                if (onMarkerSelect) onMarkerSelect(item)
              },
            }}
          >
            <Popup>
              <div className="max-w-[220px]">
                <h4 className="text-sm font-semibold">{item.name}</h4>
                <p className="text-xs">
                  {item.description || item.address}
                </p>
                <p className="text-xs font-semibold text-primary">
                  Rating: {item.rating || "N/A"}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default Map
