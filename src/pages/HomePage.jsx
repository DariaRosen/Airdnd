import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { loadHomes } from "../store/homes/homes.action.js"
import { getFormattedDateRange } from "../services/home.service.js"
import { HomesList } from "../cmps/HomesList.jsx"
import { Link } from "react-router-dom"
import { useFilterSearchParams } from "../customHooks/useFilterSearchParams"
import { loadUsers, login } from "../store/user/user.action.js"
import { utilService } from "../services/util.service.js"

const { checkIn, checkOut } = utilService.getNextMonthDates()
const dateRange = getFormattedDateRange() // e.g. "Jul 15–17"

export function HomePage() {
  const filterBy = useSelector((storeState) => storeState.homeModule.filterBy)
  const loggedInUser = useSelector(storeState => storeState.userModule.loggedInUser)
  const setExistSearchParams = useFilterSearchParams()
  const arrow1 = "/Airdnd/icons/arrow1.svg"

  useEffect(() => {
    loadHomes()
    loadUsers()
    login({ username: "avi", password: "1111" })

    setExistSearchParams(filterBy)
  }, [filterBy])

  return (
    <div className="main-page">
      {loggedInUser?.searching_history?.length > 0 && (
        <div className="continue-searching">
          <hr />
          Continue searching for homes in Athens {dateRange} – 1 guest{" "}
          <div className="arrow-icon-wrapper">
            <img
              src={arrow1}
              alt="Arrow icon"
              className="arrow-icon-gray-circle"
            />
          </div>
          <hr />
        </div>
      )}

      <div className="section-wrapper">
        <div className="text-with-icon">
          <Link to="/filter" state={{ location: "Tel Aviv-Yafo" }}>
            Popular homes in Tel Aviv-Yafo
            <img src={arrow1} alt="Arrow icon" className="arrow-icon" />
          </Link>
        </div>
        <HomesList location="Tel Aviv-Yafo" />
      </div>

      {loggedInUser?.searching_history?.length > 0 && (
        <div className="section-wrapper">
          <div className="text-with-icon">
            <Link to="/home">
              Available for similar dates
              <img src={arrow1} alt="Arrow icon" className="arrow-icon" />
            </Link>
          </div>
          <HomesList location="Tel Aviv-Yafo" checkIn="2025-08-01" checkOut="2025-08-05" />
        </div>
      )}

      <div className="section-wrapper">
        <div className="text-with-icon">
          <Link to="/filter" state={{ location: "Gran Vía" }}>
            Stay near Gran Via
            <img src={arrow1} alt="Arrow icon" className="arrow-icon" />
          </Link>
        </div>
        <HomesList location="Gran Vía" />
      </div>

      <div className="section-wrapper">
        <div className="text-with-icon">
          <Link to="/filter" state={{ location: "USA" }}>
            Popular homes in USA
            <img src={arrow1} alt="Arrow icon" className="arrow-icon" />
          </Link>
        </div>
        <HomesList location="USA" />
      </div>

      <div className="section-wrapper">
        <div className="text-with-icon">
          <Link to="/filter" state={{ checkIn, checkOut }}>
            Available next month
            <img src={arrow1} alt="Arrow icon" className="arrow-icon" />
          </Link>
        </div>
        <HomesList checkIn={checkIn} checkOut={checkOut} />
      </div>

      <div className="section-wrapper">
        <div className="text-with-icon">
          <Link to="/filter" state={{ location: "UK" }}>
            Homes in United Kingdom
            <img src={arrow1} alt="Arrow icon" className="arrow-icon" />
          </Link>
        </div>
        <HomesList location="UK" />
      </div>

      <hr />
    </div>
  )
}
