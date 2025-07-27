import { useEffect, useRef } from 'react'
import { mapService } from '../services/map.service'

export function MapView({ center = { lat: 32.0749831, lng: 34.9120554 } }) {
  const mapContainerRef = useRef(null)

  useEffect(() => {
    if (!mapContainerRef.current) return

    // Set up container for mapService
    const mapEl = mapContainerRef.current
    mapEl.classList.add('map') // required for mapService to find it

    mapService.initMap(center.lat, center.lng).then(() => {
      // Optional: Add click listener or marker here
      // mapService.addClickListener(loc => console.log('Clicked:', loc))
    })

    // Clean up on unmount
    return () => {
      mapEl.innerHTML = ''
    }
  }, [center])

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
}
