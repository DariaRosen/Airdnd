import { useEffect, useRef, useState } from "react"
import { mapService } from "../services/map.service"
import { HomeImgPreview } from "./HomeImgPreview.jsx"
import { HomeTextPreview } from "./HomeTextPreview.jsx"

export function MapView({ homes, hoveredHomeId, singleZoom = 15, markerMode = "price" }) {
  const isMapReady = useRef(false)
  const previewRef = useRef()
  const [selectedHomeId, setSelectedHomeId] = useState(null)

  useEffect(() => {
    mapService.initMap().then(() => {
      isMapReady.current = true
      if (homes?.length) {
        mapService.setMarkers(homes, hoveredHomeId, setSelectedHomeId, markerMode)
        if (homes.length === 1) {
          const h = homes[0]
          if (h?.location?.lat && h?.location?.lng) {
            setTimeout(() => {
              mapService.panTo({ lat: h.location.lat, lng: h.location.lng, zoom: singleZoom })
            }, 50)
          }
        }
      }
    })
  }, [])

  useEffect(() => {
    if (!isMapReady.current) return
    mapService.setMarkers(homes, hoveredHomeId, setSelectedHomeId, markerMode)
    if (homes?.length === 1) {
      const h = homes[0]
      if (h?.location?.lat && h?.location?.lng) {
        setTimeout(() => {
          mapService.panTo({ lat: h.location.lat, lng: h.location.lng, zoom: singleZoom })
        }, 50)
      }
    }
  }, [homes, hoveredHomeId, singleZoom, markerMode])

  useEffect(() => {
    const handleClick = ev => {
      if (previewRef.current?.contains(ev.target)) return
      if (ev.target.closest(".custom-marker")) return
      setSelectedHomeId(null)
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  const selectedHome = homes?.find(home => home._id === selectedHomeId)

  return (
    <>
      <div className="map" style={{ height: "100%", width: "100%", position: "relative" }}></div>

      {selectedHome && (
        <div className="home-preview-container-map" ref={previewRef}>
          <button className="close-btn" onClick={() => setSelectedHomeId(null)}>✕</button>
          <div>
            <HomeImgPreview home={selectedHome} onHover={() => {}} variant="map" />
            <HomeTextPreview home={selectedHome} onHover={() => {}} variant="map" />
          </div>
        </div>
      )}
    </>
  )
}
