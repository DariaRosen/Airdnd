import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { loadHomes } from "../store/homes/homes.action.js"
import { getFormattedDateRange } from "../services/home.service.js"
import { HomesList } from "../cmps/HomesList.jsx"
import { Link } from "react-router-dom"
import { useFilterSearchParams } from "../customHooks/useFilterSearchParams"

const dateRange = getFormattedDateRange() // e.g. "Jul 15–17"

export function HomePage() {
  const filterBy = useSelector((storeState) => storeState.homeModule.filterBy)

  const setExistSearchParams = useFilterSearchParams()

  const arrow1 = "/Airdnd/icons/arrow1.svg"

  useEffect(() => {
    loadHomes()
    setExistSearchParams(filterBy)
  }, [filterBy])

  return (
    <div className="main-page">
      <hr />

      <div className="continue-searching">
        Continue searching for homes in Athens {dateRange} – 1 guest{" "}
        <img src={arrow1} alt="Arrow icon" className="arrow-icon-gray-circle" />
      </div>

      <hr />

      <div className="section-wrapper">
        <div className="text-with-icon">
          <Link to="/home">
            Available for similar dates
            <img src={arrow1} alt="Arrow icon" className="arrow-icon" />
          </Link>
        </div>
        <HomesList />
      </div>

      <div className="section-wrapper">
        <div className="text-with-icon">
          <Link to="/home">
            Stay in Aegina
            <img src={arrow1} alt="Arrow icon" className="arrow-icon" />
          </Link>
        </div>
        <HomesList />
      </div>

      <div className="section-wrapper">
        <div className="text-with-icon">
          <Link to="/home">
            Popular homes in Lavreotiki
            <img src={arrow1} alt="Arrow icon" className="arrow-icon" />
          </Link>
        </div>
        <HomesList />
      </div>

      <div className="section-wrapper">
        <div className="text-with-icon">
          <Link to="/home">
            Guests also checked out Glyfada
            <img src={arrow1} alt="Arrow icon" className="arrow-icon" />
          </Link>
        </div>
        <HomesList />
      </div>

      <div className="section-wrapper">
        <div className="text-with-icon">
          <Link to="/home">
            Homes in Markopoulo Mesogaias
            <img src={arrow1} alt="Arrow icon" className="arrow-icon" />
          </Link>
        </div>
        <HomesList />
      </div>

      <hr />
    </div>
  )
}
