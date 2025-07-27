import { useEffect, useRef, useState } from "react"
import { debounce, utilService } from "../services/util.service"
import { AirdndIcon } from "./AirdndIcon"
import { useNavigate, Link } from "react-router-dom"
import { getSuggestedDestinations } from "../services/util.service.js"

export function AppHeader() {
  const navigate = useNavigate()
  const globus = "/Airdnd/icons/globus.svg"
  const select = "/Airdnd/icons/select.svg"
  const magnifying_glass = "/Airdnd/icons/magnifying_glass.svg"

  const [isLocationOpen, setIsLocationOpen] = useState(false)
  const [locationInput, setLocationInput] = useState("")
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  //const [isSearchExpanded, setIsSearchExpanded] = useState(false)

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

  const debouncedFetchLocations = debounce(async (term) => {
    const locations = await utilService.getLocationSuggestions(term)

    setLocationSuggestions(locations)
  }, 300)

  const handleLocationInput = (e) => {
    const value = e.target.value
    setLocationInput(value)
    setIsTyping(!!value)
    setIsLocationOpen(true)
    debouncedFetchLocations(value)
  }
  const handleLocationSelect = (title) => {
    setLocationInput(title)
    setIsLocationOpen(false)
  }

  return (
    <section className="header full">
      {/* LOGO + ICONS */}
      <div className="logo-wrapper">
        <Link to="/" className="logo-link">
          <AirdndIcon />
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

      {/* SEARCH BAR */}

      <div className="search-bar">
        {/* WHERE */}
        <div className="search-group location-container">
          <div className="search-item" ref={whereRef}>
            <div
              className="search-title clickable"
              onClick={() => setIsLocationOpen(!isLocationOpen)}
            >
              Where
            </div>
            <input
              type="text"
              className="search-input"
              placeholder="Search destinations"
              value={locationInput}
              onChange={handleLocationInput}
              onFocus={() => setIsLocationOpen(true)}
            />
            {isLocationOpen && (
              <div className="search-dropdown">
                {isTyping ? (
                  <ul className="suggestions-list">
                    {locationSuggestions.map((loc, idx) => (
                      <li
                        key={idx}
                        className="suggestion-item"
                        onClick={() => handleLocationSelect(loc)}
                      >
                        <img src="/Airdnd/public/icons/locationdrop.svg" alt="location img" className="suggestion-icon small-icon"/>
                        <div className="suggestion-title">{loc}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <>
                    <div className="search-suggestion-destinations">
                      Suggested destinations
                    </div>
                    <ul className="suggestions-list">
                      {getSuggestedDestinations().map(
                        ({ title, subtitle }, idx) => (
                          <li
                            key={idx}
                            className="suggestion-item"
                            onClick={() => handleLocationSelect(title)}
                          >
                            <img
                              src={utilService.getImageSrcForTitle(title)}
                              alt={title}
                              className="suggestion-icon"
                            />
                            <div>
                              <div className="suggestion-title">{title}</div>
                              <div className="suggestion-subtitle">
                                {subtitle}
                              </div>
                            </div>
                          </li>
                        )
                      )}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* SEPARATOR */}
        <div className="separator">|</div>

        {/* CHECK-IN / CHECK-OUT */}
        <div className="search-group date-container">
          <div className="search-item">
            <div className="search-title">Check in</div>
            <div className="search-value">Add dates</div>
          </div>
          <div className="separator inner">|</div>
          <div className="search-item">
            <div className="search-title">Check out</div>
            <div className="search-value">Add dates</div>
          </div>
        </div>

        {/* SEPARATOR */}
        <div className="separator">|</div>

        {/* WHO + SEARCH ICON */}
        <div className="search-group guests-container">
          <div className="search-item">
            <div className="search-title">Who</div>
            <div className="search-value">Add guests</div>
          </div>
          <Link to="/home" className="magnifying-glass-wrapper">
            <img
              src={magnifying_glass}
              alt="Search"
              className="magnifying-glass-icon"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}
