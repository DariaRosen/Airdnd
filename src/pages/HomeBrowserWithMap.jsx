import { useEffect, useState, useMemo } from 'react'
import { useSelector } from "react-redux"
import { utilService } from "../services/util.service.js"
import { MapView } from '../cmps/MapView.jsx'
import { HomeImgPreview } from "../cmps/HomeImgPreview.jsx"
import { HomeTextPreview } from "../cmps/HomeTextPreview.jsx"
import { loadHomes } from "../store/homes/homes.action.js"

export function HomeBrowserWithMap() {
  const [params, setParams] = useState({ location: '', checkIn: '', checkOut: '' })
  const [showMap, setShowMap] = useState(false)
  const [hoveredHomeId, setHoveredHomeId] = useState(null)

  const homes = useSelector((storeState) => storeState.homeModule.homes)

  // Parse query params from URL
  useEffect(() => {
    const hash = window.location.hash // "#/filter?location=Tel%20Aviv"
    const queryString = hash.split('?')[1] || ''
    const urlParams = new URLSearchParams(queryString)

    const location = urlParams.get('location') || ''
    const checkIn = urlParams.get('checkIn') || ''
    const checkOut = urlParams.get('checkOut') || ''

    const newParams = { location, checkIn, checkOut }
    setParams(newParams)

    // ✅ Call backend with filterBy
    loadHomes(newParams)

  }, [window.location.hash]) // run again if user navigates to another filter

  const filteredHomes = homes.filter(home => {
    const matchesLocation = params.location ? utilService.doesHomeMatchLocation(home, params.location) : true
    const matchesDates = (params.checkIn && params.checkOut)
      ? utilService.doesHomeMatchDates(home, params.checkIn, params.checkOut)
      : true
    return matchesLocation && matchesDates
  })

  useEffect(() => {
    if (filteredHomes.length > 0) {
      const timeoutId = setTimeout(() => setShowMap(true), 0)
      return () => clearTimeout(timeoutId)
    } else {
      setShowMap(false)
    }
  }, [filteredHomes])

  return (
    <section className="home-filter">
      <div className="home-filter-layout">
        <h2>
          {filteredHomes.length} homes in {params.location || 'your search'}
        </h2>

        <div className="homes-grid">
          {filteredHomes.map(home => (
            <div key={home._id}>
              <HomeImgPreview
                home={home}
                onHover={setHoveredHomeId}
                className="home-preview"
              />
              <HomeTextPreview
                home={home}
                onHover={setHoveredHomeId}
                variant="browser"
                className="home-preview"
              />
            </div>
          ))}
        </div>

        <div className="map-placeholder">
          <MapView homes={filteredHomes} hoveredHomeId={hoveredHomeId} />
        </div>
      </div>
    </section>
  )
}
