import { useEffect, useRef, useState } from "react"
import { debounce, utilService } from "../services/util.service"
import { AirdndIcon } from "./AirdndIcon"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { getSuggestedDestinations } from "../services/util.service.js"
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
  const globus = "/Airdnd/icons/globus.svg"
  const select = "/Airdnd/icons/select.svg"
  const magnifying_glass = "/Airdnd/icons/magnifying_glass.svg"
  const location = useLocation()
  const setExistSearchParams = useFilterSearchParams()

  const [isLocationOpen, setIsLocationOpen] = useState(false)
  const [locationInput, setLocationInput] = useState("")
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  //const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isDateOpen, setIsDateOpen] = useState(false)

  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ])
  const [guests, setGuests] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0,
  })

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
  const handleDateChange = (ranges) => {
    setDateRange([ranges.selection])
  }
  const handleSearchClick = () => {
    const filter = {
      location: locationInput,
      checkIn: dateRange[0].startDate?.toISOString(),
      checkOut: dateRange[0].endDate?.toISOString(),
      capacity: guests.adults + guests.children,
    }

    setFilterBy(filter)

    const params = new URLSearchParams()
    for (const key in filter) {
      if (filter[key]) params.set(key, filter[key])
    }

    navigate(`/filter?${params.toString()}`)
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
        <LocationSearch
          locationInput={locationInput}
          setLocationInput={setLocationInput}
        />

        {/* SEPARATOR */}
        <div className="separator">|</div>

        {/* CHECK-IN / CHECK-OUT */}
        <DateSearch dateRange={dateRange} setDateRange={setDateRange} />

        {/* SEPARATOR */}
        <div className="separator">|</div>

        {/* WHO + SEARCH ICON */}
        <GuestSearch guests={guests} setGuests={setGuests} />

        <div className="magnifying-glass-wrapper" onClick={handleSearchClick}>
          <img
            src={magnifying_glass}
            alt="Search"
            className="magnifying-glass-icon"
          />
        </div>
      </div>
    </section>
  )
}
