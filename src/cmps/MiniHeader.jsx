import { useEffect, useRef, useState } from "react"
import { AirdndIcon } from "./AirdndIcon"
import { useNavigate, Link, useLocation } from "react-router-dom"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

export function MiniHeader() {
  const globus = "/Airdnd/icons/globus.svg"
  const select = "/Airdnd/icons/select.svg"
  const location = useLocation()
  const whereRef = useRef()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (whereRef.current && !whereRef.current.contains(e.target)) {
        setIsLocationOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (location.pathname === "/") {
      setLocationInput("")
      setDateRange([{ startDate: null, endDate: null, key: "selection" }])
      setGuests({ adults: 0, children: 0, infants: 0, pets: 0 })
    }
  }, [location.pathname])

  return (
    <section className="header full">
      {/* LOGO + ICONS */}
      <div className="logo-wrapper">
        <Link to="/" className="logo-link">
          <AirdndIcon />
          <span style={{ fontSize: '1.8rem', fontWeight: 600, color: '#FF385C', padding:5  }}>airdnd</span>
        </Link>

        {/* Right Icons */}
        <div className="icon-container">
          <div className="host-text">Become a host</div>

          <Link to="/home" className="logo-link">
            <div className="icon-wrapper">
              <img
                src={globus}
                alt="Globus icon"
                className="icon-gray-circle"
              />
            </div>
          </Link>

          <Link to="/home" className="logo-link">
            <div className="icon-wrapper">
              <img
                src={select}
                alt="Select icon"
                className="icon-gray-circle"
              />
            </div>
          </Link>
        </div>
      </div>

    </section>
  )
}
