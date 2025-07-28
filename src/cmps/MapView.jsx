import { useEffect, useRef } from "react"
import { loadGoogleMaps } from '../services/map.service.js'
import { mapService } from "../services/map.service"
import { useSelector } from "react-redux" //


export function MapView({ homes }) {
  // const homes = useSelector(state => state.homeModule.homes)

  useEffect(() => {
    mapService.initMap().then(() => {
      if (homes?.length) {
        mapService.setMarkers(homes)
      }
    })
  }, [homes])

  return <div className="map" style={{ height: '100%', width: '100%' }}></div>
}