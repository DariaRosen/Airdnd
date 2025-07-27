import { useRef, useState, useEffect } from "react"
import { debounce, utilService, getSuggestedDestinations } from "../services/util.service"

export function LocationSearch({ locationInput, setLocationInput }) {
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [isLocationOpen, setIsLocationOpen] = useState(false)
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
                    <img
                      src="/Airdnd/public/icons/locationdrop.svg"
                      alt="location img"
                      className="suggestion-icon small-icon"
                    />
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
                  {getSuggestedDestinations().map(({ title, subtitle }, idx) => (
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
                        <div className="suggestion-subtitle">{subtitle}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
