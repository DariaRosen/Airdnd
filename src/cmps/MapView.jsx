import { useEffect, useRef } from "react"
import { mapService } from "../services/map.service"

export function MapView({ homes, hoveredHomeId }) {
  const isMapReady = useRef(false)

  useEffect(() => {
    // Only run once
    mapService.initMap().then(() => {
      isMapReady.current = true
      if (homes?.length) {
        mapService.setMarkers(homes, hoveredHomeId)
      }
    })
  }, []) // ← run only on mount

  useEffect(() => {
    // Run every time homes or hovered ID changes, *but only if map is ready*
    if (isMapReady.current) {
      mapService.setMarkers(homes, hoveredHomeId)
    }
  }, [homes, hoveredHomeId]) // ← updates markers only, not whole map

  return <div className="map" style={{ height: '100%', width: '100%' }}></div>
}
