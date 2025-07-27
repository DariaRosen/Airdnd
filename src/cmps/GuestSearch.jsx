import { useState, useEffect, useRef } from "react"

export function GuestSearch({ guests, setGuests }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef()

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
        <div className="search-value">Add guests</div>
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
