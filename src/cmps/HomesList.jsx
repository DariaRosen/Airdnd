import { useState } from "react";
import { HomePreview } from "./HomePreview.jsx";
import { Link } from 'react-router-dom'
import { utilService } from "../services/util.service.js"
import { useSelector } from "react-redux"
import { CgLayoutGrid } from "react-icons/cg";

export function HomesList({ location, checkIn, checkOut }) {
  const homes = useSelector((storeState) => storeState.homeModule.homes)
  const [startIdx, setStartIdx] = useState(0)
  const itemsPerPage = 7
  const arrow1 = "/Airdnd/icons/arrow1.svg"

  const next = () => {
    setStartIdx((prev) => Math.min(prev + 1, total - itemsPerPage))
  }

  const prev = () => {
    setStartIdx((prev) => Math.max(prev - 1, 0))
  }

  // 🔍 Filter homes based on props
  const filteredHomes = homes.filter(home => {

    const matchesLocation = location ? utilService.doesHomeMatchLocation(home, location) : true
    const matchesDates = (checkIn && checkOut) ? utilService.doesHomeMatchDates(home, checkIn, checkOut) : true
    return matchesLocation && matchesDates
  })
  const total = filteredHomes.length
  const visibleHomes = filteredHomes.slice(startIdx, startIdx + itemsPerPage)
console.log('visibleHomes', visibleHomes);

  return (
    <section className="home-carousel-wrapper">
      <div className="home-carousel-header">
        <button
          onClick={prev}
          disabled={startIdx === 0}
          className="circle-arrow-btn"
        >
          <img src={arrow1} alt="Previous" className="arrow-icon rotate-left" />
        </button>

        <button
          onClick={next}
          disabled={startIdx >= total - itemsPerPage}
          className="circle-arrow-btn"
        >
          <img src={arrow1} alt="Next" className="arrow-icon" />
        </button>
      </div>

      <section className="home-carousel">
        <ul className="home-list">
          {visibleHomes.map(home => (
            <li className="home-preview" key={home._id}>
              <HomePreview home={home} />
            </li>
          ))}
        </ul>
        {filteredHomes.length === 0 && (
          <p className="no-results-msg">No homes match your search.</p>
        )}
      </section>
    </section>
  )
}

//gets props, example: <HomesList location="Tel Aviv-Yafo" checkIn="2025-08-01" checkOut="2025-08-05" />