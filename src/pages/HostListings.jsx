import { useEffect, useState } from "react"
import { homeService } from "../services/home.service"
import { HostDashboardHeader } from "../cmps/HostDashboardHeader"
import { Pencil } from "lucide-react" // install lucide-react if not already

export function HostListings() {
    const [homes, setHomes] = useState([])
    const [expanded, setExpanded] = useState({}) // track expanded descriptions

    const user = {
        _id: "68c242e0ac0d57e02713467f",
        firstName: "Harry",
        lastName: "Potter",
        username: "harry123",
        email: "harry@gmail.com",
    }
    const hostId = user._id

    useEffect(() => {
        async function loadHomes() {
            const allHomes = await homeService.query()
            const hostHomes = allHomes
                .map(homeService.normalize)
                .filter(home => home.hostId === hostId)

            setHomes(hostHomes)  // full homes with all fields intact
            console.log("hostHomes", hostHomes);

        }
        loadHomes()
    }, [hostId])

    async function saveHome(updatedHome) {
        try {
            const saved = await homeService.save(updatedHome) // this returns normalized home with imgUrls + imgUrl
            setHomes(prev =>
                prev.map(h => (h._id === saved._id ? saved : h))
            )
        } catch (err) {
            console.error("Failed to save", err)
        }
    }

    function toggleExpand(id) {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
    }

    function EditableField({ value, onSave, type = "text", truncate = 0 }) {
        const [isEditing, setIsEditing] = useState(false)
        const [draft, setDraft] = useState(value)

        // sync draft with latest prop value
        useEffect(() => {
            setDraft(value)
        }, [value])

        function handleSave() {
            setIsEditing(false)
            if (draft !== value) onSave(draft)
        }

        if (isEditing) {
            return type === "textarea" ? (
                <textarea
                    autoFocus
                    value={draft}
                    onChange={ev => setDraft(ev.target.value)}
                    onBlur={handleSave}
                    onKeyDown={ev =>
                        ev.key === "Enter" && !ev.shiftKey && handleSave()
                    }
                />
            ) : (
                <input
                    type={type}
                    autoFocus
                    value={draft}
                    onChange={ev => setDraft(ev.target.value)}
                    onBlur={handleSave}
                    onKeyDown={ev => ev.key === "Enter" && handleSave()}
                />
            )
        }

        const displayText =
            truncate && value.length > truncate
                ? value.slice(0, truncate) + "..."
                : value

        return (
            <div className="editable-field" onClick={() => setIsEditing(true)}>
                <span>{displayText}</span>
                <Pencil className="edit-icon" />
            </div>
        )
    }

    console.log("home.imgUrl", homes);

    return (
        <section className="host-listings">
            <HostDashboardHeader logoText="Add New Listing" />
            <div className="listings-grid">
                {homes.map(home => (
                    <div key={home._id} className="listing-card">
                        <div className="listing-avatar">
                            <img src={home.imgUrl} alt={home.title} />
                        </div>
                        <div className="listing-info">
                            <div className="editable-title">
                                <EditableField
                                    className="title-field-home"
                                    value={home.title}
                                    onSave={val => saveHome({ ...home, title: val })}
                                />
                            </div>

                            <div className="editable-description">
                                <EditableField
                                    value={home.description}
                                    onSave={val =>
                                        saveHome({ ...home, description: val })
                                    }
                                    type="textarea"
                                    truncate={!expanded[home._id] ? 60 : 0}
                                />
                                {home.description.length > 60 && (
                                    <button
                                        type="button"
                                        className="show-more-btn"
                                        onClick={() => toggleExpand(home._id)}
                                    >
                                        {expanded[home._id]
                                            ? "Show less"
                                            : "Show more"}
                                    </button>
                                )}
                            </div>
                            <div className="price-field-wrapper">
                                <label>Price: </label>
                                <EditableField
                                    value={String(home.price)}
                                    onSave={val => saveHome({ ...home, price: Number(val) })}
                                    type="number"
                                />
                            </div>

                            <div className="capacity-field-wrapper">
                                <label>Capacity: </label>
                                <EditableField
                                    value={String(home.capacity)}
                                    onSave={val =>
                                        saveHome({ ...home, capacity: Number(val) })
                                    }
                                    type="number"
                                />
                            </div>

                            <p className="listing-rating">
                                ⭐ {home.rating?.toFixed(2)} (
                                {home.numberOfRaters ?? 0})
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
