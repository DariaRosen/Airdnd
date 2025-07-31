import { useEffect, useRef, useState } from "react"
import { mapService } from "../services/map.service"
import { HomePreviewBrowserMap } from "./HomePreviewBrowserMap.jsx"

export function MapView({ homes, hoveredHomeId }) {
  const isMapReady = useRef(false)
  const [selectedHomeId, setSelectedHomeId] = useState(null)

  useEffect(() => {
    mapService.initMap().then(() => {
      isMapReady.current = true
      if (homes?.length) {
        mapService.setMarkers(homes, hoveredHomeId, setSelectedHomeId)
      }
    })
  }, [])

  useEffect(() => {
    if (isMapReady.current) {
      mapService.setMarkers(homes, hoveredHomeId, setSelectedHomeId)
    }
  }, [homes, hoveredHomeId])

  // Find the selected home object
  const selectedHome = homes?.find(home => home._id === selectedHomeId)

  return (
    <>
      <div className="map" style={{ height: '100%', width: '100%', position: 'relative' }}></div>

      {/* Render HomePreviewBrowserMap if a home is selected */}
      {selectedHome && (
        <div className="home-preview-container">
          <button
            className="close-btn"
            onClick={() => setSelectedHomeId(null)}
          >
            ✕
          </button>
          <HomePreviewBrowserMap home={selectedHome} onHover={() => { }} />
        </div>
      )}
    </>
  )
}
