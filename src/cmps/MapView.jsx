import { useEffect, useRef } from "react"
import { loadGoogleMaps } from '../services/map.service.js'

export function MapView({ homes }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)

  useEffect(() => {
    const VITE_GOOGLE_MAPS_API_KEY='AIzaSyBljDF6gKT-m-nzL0Okmu4xNduoBEd2m3k'
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    
    if (!apiKey) {
      console.error("Missing Google Maps API key")
      return
    }

    loadGoogleMapsAPI(apiKey).then(() => {
      if (!mapRef.current) return

      const center = homes.length
        ? { lat: homes[0].location.lat, lng: homes[0].location.lng }
        : { lat: 51.5, lng: -0.1 }

      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 10,
      })

      // Create custom HTML markers
      homes.forEach(home => {
        if (home?.location?.lat && home?.location?.lng) {
          const markerEl = document.createElement("div")
          markerEl.className = "price-marker"
          markerEl.innerText = `$${home.price}`

          new window.google.maps.OverlayView().onAdd = function () {
            const panes = this.getPanes()
            panes.overlayMouseTarget.appendChild(markerEl)

            const projection = this.getProjection()
            this.draw = function () {
              const position = projection.fromLatLngToDivPixel(
                new window.google.maps.LatLng(home.location.lat, home.location.lng)
              )
              if (position) {
                markerEl.style.position = "absolute"
                markerEl.style.left = position.x - 25 + "px"
                markerEl.style.top = position.y - 25 + "px"
              }
            }
          }.bind(new window.google.maps.OverlayView())
        }
      })
    })
  }, [homes])
  return (
    <>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
      <style>
        {`
          .price-marker {
            background: white;
            border: 1px solid #ccc;
            border-radius: 999px;
            padding: 6px 12px;
            font-weight: bold;
            font-size: 14px;
            color: #222;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            white-space: nowrap;
            transform: translate(-50%, -50%);
            pointer-events: auto;
            cursor: pointer;
          }
        `}
      </style>
    </>
  )
}
