import { useState } from "react";
import { HomePreview } from "./HomePreview.jsx";
import { Link } from 'react-router-dom'
import { useSelector } from "react-redux"

export function HomesList() {
  const homes = useSelector((storeState) => storeState.homeModule.homes)
  const [startIdx, setStartIdx] = useState(0)
  const itemsPerPage = 7
  const total = homes.length

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
      <button onClick={prev} disabled={startIdx === 0}>&larr;</button>
      <button onClick={next} disabled={startIdx >= total - itemsPerPage}>&rarr;</button>
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
