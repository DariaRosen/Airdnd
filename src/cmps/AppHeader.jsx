import { useEffect, useRef, useState } from 'react'
import { debounce, utilService } from '../services/util.service'
import { AirdndIcon } from "./AirdndIcon"
import { useNavigate, Link } from "react-router-dom"

export function AppHeader() {
  const navigate = useNavigate()
  const globus = "/Airdnd/icons/globus.svg"
  const select = "/Airdnd/icons/select.svg"
  const magnifying_glass = "/Airdnd/icons/magnifying_glass.svg"

  const [isLocationOpen, setIsLocationOpen] = useState(false)
  const [locationInput, setLocationInput] = useState('')
  const [locationSuggestions, setLocationSuggestions] = useState([])

  const whereRef = useRef()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (whereRef.current && !whereRef.current.contains(e.target)) {
        setIsLocationOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const debouncedFetchLocations = debounce(async (term) => {
    const locations = await utilService.getLocationSuggestions(term)
    setLocationSuggestions(locations)
  }, 300)

  const handleLocationInput = (e) => {
    const value = e.target.value
    setLocationInput(value)
    debouncedFetchLocations(value)
  }

  return (
    <section className="header">
      {/* LOGO + ICONS */}
      <div className="logo-wrapper">
        <Link to="/" className="logo-link">
          <AirdndIcon />
        </Link>

        <div className="video-container">
          {/* Video Icons */}
          {[
            {
              src: 'house-twirl-selected',
              title: 'Homes'
            },
            {
              src: 'balloon-twirl',
              title: 'Experiences'
            },
            {
              src: 'consierge-twirl',
              title: 'Services'
            }
          ].map(({ src, title }) => (
            <div className="video-item" key={title}>
              <video className="logo-video" autoPlay loop muted playsInline poster={`https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/${src}.png?im_w=240`}>
                <source src={`https://a0.muscache.com/videos/search-bar-icons/webm/${src}.webm`} type="video/webm" />
                <source src={`https://a0.muscache.com/videos/search-bar-icons/hevc/${src}.mov`} type="video/mp4" />
              </video>
              <span className="video-title">{title}</span>
            </div>
          ))}
        </div>

        {/* Right Icons */}
        <div className="icon-container">
          <div className="host-text">Become a host</div>
          <Link to="/home" className="logo-link"><img src={globus} alt="Globus icon" className="globus-icon" /></Link>
          <Link to="/home" className="logo-link"><img src={select} alt="Select icon" className="select-icon" /></Link>
        </div>
      </div>

      {/* SEARCH BAR */}
    <div className="search-bar">
      {/* WHERE */}
      <div className="search-item" ref={whereRef}>
        <div className="search-title clickable" onClick={() => setIsLocationOpen(!isLocationOpen)}>
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
            <div className="search-option nearby">Nearby</div>
            <div className="search-option find-around">Find what's around me</div>
            {locationSuggestions.length > 0 && (
              <ul className="suggestions-list">
                {locationSuggestions.map((loc, idx) => (
                  <li key={idx} className="suggestion-item">{loc}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="separator">|</div>

      {/* CHECK-IN */}
      <div className="search-item">
        <div className="search-title">Check in</div>
        <div className="search-value">Add dates</div>
      </div>

      <div className="separator">|</div>

      {/* CHECK-OUT */}
      <div className="search-item">
        <div className="search-title">Check out</div>
        <div className="search-value">Add dates</div>
      </div>

      <div className="separator">|</div>

      {/* WHO + ICON*/}
      <div className="search-item">
        <div className="search-title">Who</div>
        <div className="search-value">Add guests</div>
      </div>

      <div className="search-item">
        <Link to="/home" className="magnifying-glass-wrapper">
          <img src={magnifying_glass} alt="Search" className="magnifying-glass-icon" />
        </Link>
      </div>
    </div>

    </section>
  )
}
