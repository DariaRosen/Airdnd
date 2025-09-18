import { useSearchParams } from "react-router-dom"
import { useState, useEffect } from "react"

export function useBookingParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Initialize guests from URL or default
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || "")
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || "")
  const [guests, setGuests] = useState(() => {
    const g = parseInt(searchParams.get("guests"))
    // Default to { adults: 2, children: 0, infants: 0, pets: 0 }
    return isNaN(g) ? { adults: 2, children: 0, infants: 0, pets: 0 } : { adults: g, children: 0, infants: 0, pets: 0 }
  })

  // Sync state → URL
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams)
    checkIn ? newParams.set("checkIn", checkIn) : newParams.delete("checkIn")
    checkOut ? newParams.set("checkOut", checkOut) : newParams.delete("checkOut")

    // Save total guests for URL
    const totalGuests = (guests.adults || 0) + (guests.children || 0)
    newParams.set("guests", totalGuests)

    setSearchParams(newParams, { replace: true })
  }, [checkIn, checkOut, guests])

  // Sync URL → state (only on external changes)
  useEffect(() => {
    const inParam = searchParams.get("checkIn") || ""
    const outParam = searchParams.get("checkOut") || ""
    const guestsParam = parseInt(searchParams.get("guests"))

    if (inParam !== checkIn) setCheckIn(inParam)
    if (outParam !== checkOut) setCheckOut(outParam)
    // Only update adults if URL changed externally
    if (!isNaN(guestsParam) && guestsParam !== (guests.adults + guests.children)) {
      setGuests(prev => ({ ...prev, adults: guestsParam }))
    }
  }, [searchParams])

  return {
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    guests,
    setGuests,
  }
}
