import { useEffect, useState, useMemo } from 'react'
import { useSelector } from "react-redux"
import { HomePreview } from "./HomePreview.jsx"
import { utilService } from "../services/util.service.js"
import { MapView } from './MapView'

export function HomeFilter() {
  const [params, setParams] = useState({ location: '', checkIn: '', checkOut: '' })

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

  return (
    <section className="home-filter">
      <h2>{filteredHomes.length} homes within map area</h2>

      <div className="home-filter-layout">
        <div className="homes-grid">
          {filteredHomes.map(home => (
            <HomePreview key={home._id} home={home} />
          ))}
        </div>

        <div className="map-placeholder" style={{ width: '400px', height: '400px' }}>
          <MapView />
        </div>
      </div>
    </section>
  )
}
