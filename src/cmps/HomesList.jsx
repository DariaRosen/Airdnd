import { useState } from "react";
import { HomePreview } from "./HomePreview.jsx";
import { Link } from 'react-router-dom'
import { useSelector } from "react-redux"

export function HomesList() {
  const homes = useSelector((storeState) => storeState.homeModule.homes)
  const [startIdx, setStartIdx] = useState(0)
  const itemsPerPage = 7
  const total = homes.length
  const arrow1 = "/Airdnd/icons/arrow1.svg"
  const next = () => {
    setStartIdx((prev) => Math.min(prev + 1, total - itemsPerPage))
  }

  const prev = () => {
    setStartIdx((prev) => Math.max(prev - 1, 0))
  }

  const visibleHomes = homes.slice(startIdx, startIdx + itemsPerPage)

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
      </section>
    </section>
  )
}
