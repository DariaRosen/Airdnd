import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { HomePreview } from "./HomePreview.jsx"
import { utilService } from "../services/util.service.js"

export function HomeFilter() {
  const locationObj = useLocation()
  const filterParams = locationObj.state || {}
  const { location: locationFilter, checkIn, checkOut } = filterParams
  const homes = useSelector((storeState) => storeState.homeModule.homes)

  const filteredHomes = homes.filter(home => {
    const matchesLocation = locationFilter
      ? utilService.doesHomeMatchLocation(home, locationFilter)
      : true

    const matchesDates = (checkIn && checkOut)
      ? utilService.doesHomeMatchDates(home, checkIn, checkOut)
      : true

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

    <div className="map-placeholder">
      Map
    </div>
  </div>
</section>

  )
}
