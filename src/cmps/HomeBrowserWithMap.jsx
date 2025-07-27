import { useEffect, useState, useMemo } from 'react'
import { useSelector } from "react-redux"
import { HomePreview } from "./HomePreview.jsx"
import { utilService } from "../services/util.service.js"
import { MapView } from './MapView.jsx'

export function HomeBrowserWithMap() {
  const [params, setParams] = useState({ location: '', checkIn: '', checkOut: '' })
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    const hash = window.location.hash // "#/filter?location=UK"
    const queryString = hash.split('?')[1] || ''
    const urlParams = new URLSearchParams(queryString)
    const location = urlParams.get('location')
    const checkIn = urlParams.get('checkIn')
    const checkOut = urlParams.get('checkOut')
    setParams({ location, checkIn, checkOut })
  }, [])

  const homes = useSelector((storeState) => storeState.homeModule.homes)

  const filteredHomes = homes.filter(home => {
    const matchesLocation = params.location ? utilService.doesHomeMatchLocation(home, params.location) : true
    const matchesDates = (params.checkIn && params.checkOut) ? utilService.doesHomeMatchDates(home, params.checkIn, params.checkOut) : true
    return matchesLocation && matchesDates
  })

  useEffect(() => {
    if (filteredHomes.length > 0) {
      // Wait for next paint after render to ensure <HomePreview /> elements are in DOM
      const timeoutId = setTimeout(() => {
        setShowMap(true)
      }, 0)
      return () => clearTimeout(timeoutId)
    } else {
      setShowMap(false)
    }
  }, [filteredHomes])

  return (
    <section className="home-filter">
      <h2>{filteredHomes.length} homes within map area</h2>

      <div className="home-filter-layout">
        <div className="homes-grid">
          {filteredHomes.map(home => (
            <HomePreview key={home._id} home={home} />
          ))}
        </div>

        {/* <div className="map-placeholder" style={{ width: '400px', height: '400px' }}>
          {showMap && <MapView homes={filteredHomes} />}
        </div> */}
      </div>
    </section>
  )
}
