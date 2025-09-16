import { useEffect, useRef, useState } from "react"
import { debounce, utilService } from "../services/util.service"
import { AirdndIcon } from "./AirdndIcon"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { DateRange } from "react-date-range"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import { LocationSearch } from "./LocationSearch.jsx"
import { DateSearch } from "./DateSearch.jsx"
import { GuestSearch } from "./GuestSearch.jsx"
import { setFilterBy } from "../store/homes/homes.action.js"
import { useFilterSearchParams } from "../customHooks/useFilterSearchParams"

export function AppHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const setExistSearchParams = useFilterSearchParams()

  const [activeItem, setActiveItem] = useState(null)
  const [locationInput, setLocationInput] = useState("")
  const [dateRange, setDateRange] = useState([
    { startDate: null, endDate: null, key: "selection" }
  ])
  const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 })

  const searchBarRef = useRef(null)
  const inputRef = useRef(null)

  // Close bar if clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
        setActiveItem(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Reset filters when navigating home
  useEffect(() => {
    if (location.pathname === "/") {
      setLocationInput("")
      setDateRange([{ startDate: null, endDate: null, key: "selection" }])
      setGuests({ adults: 0, children: 0, infants: 0, pets: 0 })
    }
  }, [location.pathname])

  const debouncedFetchLocations = debounce(async (term) => {
    const locations = await utilService.getLocationSuggestions(term)
    // setLocationSuggestions(locations)  // optional if using a list in LocationSearch
  }, 300)

  const handleLocationInput = (e) => {
    const value = e.target.value
    setLocationInput(value)
    debouncedFetchLocations(value)
  }

  const handleClickItem1 = () => {
    setActiveItem(1)
    if (inputRef.current) inputRef.current.focus()
  }

  const handleItemClick = (num) => setActiveItem(num)

  const handleSearchClick = () => {
    const filter = {
      location: locationInput,
      checkIn: dateRange[0].startDate?.toISOString().slice(0, 10),
      checkOut: dateRange[0].endDate?.toISOString().slice(0, 10),
      capacity: guests.adults + guests.children
    }

    setFilterBy(filter)

    const params = new URLSearchParams()
    for (const key in filter) if (filter[key]) params.set(key, filter[key])

    setActiveItem(null) // deactivate search bar
    navigate(`/filter?${params.toString()}`)
  }

  const globus = "/Airdnd/icons/globus.svg"
  const select = "/Airdnd/icons/select.svg"
  const magnifying_glass = "/Airdnd/icons/magnifying_glass.svg"

  return (
    <section className="header full">
      {/* LOGO + ICONS */}
      <div className="logo-wrapper">
        <Link to="/" className="logo-link">
          <AirdndIcon />
          <span style={{ fontSize: "1.8rem", fontWeight: 600, color: "#FF385C", padding: 5 }}>
            airdnd
          </span>
        </Link>

        <div className="icon-container">
          <div className="host-text-wrapper" onClick={() => navigate("/become-host")}>
            <div className="host-text">Become a host</div>
          </div>

          <Link to="/home" className="logo-link">
            <div className="icon-wrapper">
              <img src={globus} alt="Globus icon" className="icon-gray-circle" />
            </div>
          </Link>

          <Link to="/home" className="logo-link">
            <div className="icon-wrapper">
              <img src={select} alt="Select icon" className="icon-gray-circle" />
            </div>
          </Link>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div ref={searchBarRef} className={`search-bar ${activeItem ? "bar-active" : ""}`}>
        {/* Group 1: WHERE */}
        <div className="group group-1">
          <div
            className={`search-item1 ${activeItem === 1 ? "active" : ""}`}
            onClick={handleClickItem1}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleClickItem1()}
          >
            <LocationSearch ref={inputRef} locationInput={locationInput} setLocationInput={setLocationInput} />
          </div>
        </div>

        {/* Group 2: CHECK-IN */}
        <div className="group group-2">
          <div className="separator separator1" />
          <div className={`search-item2 ${activeItem === 2 ? "active" : ""}`} onClick={() => handleItemClick(2)}>
            <DateSearch type="checkIn" dateRange={dateRange} setDateRange={setDateRange} />
          </div>
        </div>

        {/* Group 3: CHECK-OUT */}
        <div className="group group-3">
          <div className="separator separator2" />
          <div className={`search-item3 ${activeItem === 3 ? "active" : ""}`} onClick={() => handleItemClick(3)}>
            <DateSearch type="checkOut" dateRange={dateRange} setDateRange={setDateRange} />
          </div>
        </div>

        {/* Group 4: GUESTS + SEARCH BUTTON */}
        <div className="group group-4">
          <div className="separator separator3" />
          <div className={`search-item4 ${activeItem === 4 ? "active" : ""}`} onClick={() => handleItemClick(4)}>
            <GuestSearch guests={guests} setGuests={setGuests} />

            <div
              className={`magnifying-glass-wrapper ${activeItem ? "expanded" : ""}`}
              onClick={(e) => {
                e.stopPropagation()
                handleSearchClick()
                setActiveItem(null)
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
            >
              {activeItem ? (
                <span className="search-label">
                  <img src={magnifying_glass} alt="Search" className="magnifying-glass-icon" />
                  <span>Search</span>
                </span>
              ) : (
                <img src={magnifying_glass} alt="Search" className="magnifying-glass-icon" />
              )}
            </div>


          </div>
        </div>
      </div>
    </section>
  )
}
