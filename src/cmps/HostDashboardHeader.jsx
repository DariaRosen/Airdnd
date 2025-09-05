import { useEffect, useRef, useState } from "react"
import { AirdndIcon } from "./AirdndIcon"
import { Link, useLocation } from "react-router-dom"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

export function HostDashboardHeader() {
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

  const isActive = (path) => location.pathname === path

  return (
    <section className="mini-header">
      {/* LOGO + ICONS */}
      <div className="logo-wrapper">
        <Link to="/" className="logo-link">
          <AirdndIcon />
          <span className="logo-text">airdnd</span>
        </Link>

        {/* Title */}
        <div className="title-container">
          <h1>Welcome, Daria Levi!</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <Link to="/host-dashboard" className={`tab-link ${isActive("/host-dashboard") ? "active" : ""}`}>
          Dashboard
        </Link>
        <Link to="/host-bookings" className={`tab-link ${isActive("/host-bookings") ? "active" : ""}`}>
          Bookings
        </Link>
        <Link to="/host-listings" className={`tab-link ${isActive("/host-listings") ? "active" : ""}`}>
          Add New Home
        </Link>
      </div>
    </section>
  )
}
