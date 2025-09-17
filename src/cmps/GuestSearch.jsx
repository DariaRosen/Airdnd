import { useState, useEffect, useRef } from "react"

export function GuestSearch({ guests, setGuests, isDetails = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef()
  const title = isDetails ? "GUESTS" : "Who"
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const updateCount = (field, diff) => {
    setGuests((prev) => ({
      ...prev,
      [field]: Math.max(0, prev[field] + diff),
    }))
  }
  const normalizedGuests = typeof guests === "number"
    ? { adults: guests, children: 0, infants: 0, pets: 0 }
    : guests

  return (
    <div className="search-group guest-container" ref={dropdownRef}>
      <div className="search-item" onClick={() => setIsOpen(!isOpen)}>
        <div className="search-title">{title}</div>
        <div className="search-value">
          {normalizedGuests.adults + normalizedGuests.children + normalizedGuests.infants + normalizedGuests.pets > 0
            ? (() => {
              const parts = []
              const totalGuests = normalizedGuests.adults + normalizedGuests.children
              if (totalGuests > 0) parts.push(`${totalGuests} guest${totalGuests > 1 ? "s" : ""}`)
              if (normalizedGuests.infants > 0) parts.push(`${normalizedGuests.infants} infant${normalizedGuests.infants > 1 ? "s" : ""}`)
              if (normalizedGuests.pets > 0) parts.push(`${normalizedGuests.pets} pet${normalizedGuests.pets > 1 ? "s" : ""}`)

              return parts.length > 2
                ? parts.slice(0, 2).join(", ") + " ..."
                : parts.join(", ")
            })()
            : "Add guests"}
        </div>

      </div>

      {isOpen && (
        <div className="guest-dropdown">
          {[
            { label: "Adults", desc: "Ages 13 or above", field: "adults" },
            { label: "Children", desc: "Ages 2–12", field: "children" },
            { label: "Infants", desc: "Under 2", field: "infants" },
            {
              label: "Pets",
              desc: "Bringing a service animal?",
              field: "pets",
            },
          ].map(({ label, desc, field }) => (
            <div className="guest-row" key={field}>
              <div className="guest-info">
                <div className="label">{label}</div>
                <div className="desc">{desc}</div>
              </div>
              <div className="btns">
                <button onClick={() => updateCount(field, -1)}>-</button>
                <span>{normalizedGuests[field]}</span>
                <button onClick={() => updateCount(field, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
