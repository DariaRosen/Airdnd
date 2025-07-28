import { useState, useEffect, useRef } from "react"

export function GuestSearch({ guests, setGuests }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef()
  const guestCount = guests.adults + guests.children

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

  return (
    <div className="search-group guest-container" ref={dropdownRef}>
      <div className="search-item" onClick={() => setIsOpen(!isOpen)}>
        <div className="search-title">Who</div>
        <div className="search-value">
          {guests.adults + guests.children + guests.infants + guests.pets > 0
            ? (() => {
                const parts = []

                const totalGuests = guests.adults + guests.children
                if (totalGuests > 0)
                  parts.push(
                    `${totalGuests} guest${totalGuests > 1 ? "s" : ""}`
                  )
                if (guests.infants > 0)
                  parts.push(
                    `${guests.infants} infant${guests.infants > 1 ? "s" : ""}`
                  )
                if (guests.pets > 0)
                  parts.push(`${guests.pets} pet${guests.pets > 1 ? "s" : ""}`)

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
                <span>{guests[field]}</span>
                <button onClick={() => updateCount(field, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
