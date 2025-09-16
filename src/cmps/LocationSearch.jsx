import { useRef, useState, useEffect, forwardRef } from "react"
import { debounce, utilService, getSuggestedDestinations } from "../services/util.service"

export const LocationSearch = forwardRef(({ locationInput, setLocationInput, onLocationSelected }, ref) => {
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [isLocationOpen, setIsLocationOpen] = useState(false)
  const whereRef = useRef()

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (whereRef.current && !whereRef.current.contains(e.target)) {
        setIsLocationOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Debounced fetch
  const debouncedFetchLocations = debounce(async (term) => {
    if (!term) return setLocationSuggestions([])
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
    if (onLocationSelected) onLocationSelected() // callback to parent
    // force blur to close keyboard/focus state
    if (whereRef.current) {
      const inputEl = whereRef.current.querySelector("input")
      if (inputEl) inputEl.blur()
    }
  }
  return (
    <div className="search-group location-container" ref={whereRef}>
      <div className="search-item">
        <div
          className="search-title clickable"
          onClick={() => setIsLocationOpen(!isLocationOpen)}
        >
          Where
        </div>
        <input
          type="text"
          ref={ref} // forwarded ref
          className="search-input"
          placeholder="Search destinations"
          value={locationInput}
          onChange={handleLocationInput}
          onFocus={() => setIsLocationOpen(true)}
        />

        {isLocationOpen && (
          <div className="search-dropdown">
            <div className="search-dropdown-inner">
              {isTyping ? (
                <ul className="suggestions-list">
                  {locationSuggestions.map((loc, idx) => (
                    <li
                      key={idx}
                      className="suggestion-item"
                      onClick={() => handleLocationSelect(loc)}
                    >
                      <img
                        src="/Airdnd/icons/locationdrop.svg"
                        alt="location icon"
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
          </div>
        )}
      </div>
    </div>
  )
})
