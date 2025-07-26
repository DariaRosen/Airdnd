import { useState, useRef, useEffect } from "react";
import { HomePreview } from "./HomePreview.jsx";
import { Link } from 'react-router-dom'
import { utilService } from "../services/util.service.js"
import { useSelector } from "react-redux"
import { CgLayoutGrid } from "react-icons/cg";

export function HomesList({ location, checkIn, checkOut }) {
  const homes = useSelector(storeState => storeState.homeModule.homes)
  const [startIdx, setStartIdx] = useState(0)
  const [visibleCount, setVisibleCount] = useState(7)
  const carouselRef = useRef()
  const arrow1 = "/Airdnd/icons/arrow1.svg"

  useEffect(() => {
    function handleResize() {
      if (!carouselRef.current) return
      const containerWidth = carouselRef.current.offsetWidth
      const minWidth = 165
      const maxItems = Math.floor(containerWidth / minWidth)
      setVisibleCount(Math.min(maxItems, 7))
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const filteredHomes = homes.filter(home => {
    const matchesLocation = location ? utilService.doesHomeMatchLocation(home, location) : true
    const matchesDates = (checkIn && checkOut) ? utilService.doesHomeMatchDates(home, checkIn, checkOut) : true
    return matchesLocation && matchesDates
  })

  const total = filteredHomes.length
  const endIdx = Math.min(startIdx + visibleCount, total)
  const visibleHomes = filteredHomes.slice(startIdx, endIdx)

  const next = () => {
    setStartIdx(prev => Math.min(prev + 1, total - visibleCount))
  }

  const prev = () => {
    setStartIdx(prev => Math.max(prev - 1, 0))
  }

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
          disabled={startIdx >= total - visibleCount}
          className="circle-arrow-btn"
        >
          <img src={arrow1} alt="Next" className="arrow-icon" />
        </button>
      </div>

      <section className="home-carousel" ref={carouselRef}>
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