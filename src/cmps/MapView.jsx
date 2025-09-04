import { useEffect, useRef, useState } from "react"
import { mapService } from "../services/map.service"
import { HomeImgPreview } from "./HomeImgPreview.jsx"
import { HomeTextPreview } from "./HomeTextPreview.jsx"

export function MapView({ homes, hoveredHomeId }) {
  const isMapReady = useRef(false)
  const previewRef = useRef()  // ← This was missing
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

  useEffect(() => {
    const handleClick = (ev) => {
      if (previewRef.current?.contains(ev.target)) return
      if (ev.target.closest('.custom-marker')) return
      setSelectedHomeId(null)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const selectedHome = homes?.find(home => home._id === selectedHomeId)

  return (
    <>
      <div className="map" style={{ height: '100%', width: '100%', position: 'relative' }}></div>

      {selectedHome && (
        <div className="home-preview-container-map" ref={previewRef}>
          <button className="close-btn" onClick={() => setSelectedHomeId(null)}>✕</button>
          <div>
            <HomeImgPreview
              home={selectedHome}
              onHover={() => { }}
              variant="map"
            />
            <HomeTextPreview
              home={selectedHome}
              onHover={() => { }}
              variant="map"
            />
          </div>
        </div>
      )}
    </>
  )
}
