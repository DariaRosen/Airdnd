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
                .filter(home => home.host_id === hostId)
                .map(home => ({
                    _id: home._id,
                    title: home.title,
                    description: home.description,
                    price: home.price,
                    capacity: home.capacity,
                    imgUrl: home.imgUrls?.[0] || "",
                    rating: home.rating ?? 0,
                    numberOfRaters: home.numberOfRaters ?? 0,
                }))
            setHomes(hostHomes)
        }
        loadHomes()
    }, [hostId])

    async function saveHome(updatedHome) {
        try {
            await homeService.save(updatedHome)
            setHomes(prev =>
                prev.map(h => (h._id === updatedHome._id ? updatedHome : h))
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
            <div
                className="editable-field"
                onClick={() => setIsEditing(true)}
            >
                <span>{displayText}</span>
                <Pencil className="edit-icon" />
            </div>
        )
    }

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
                            <EditableField
                                value={home.title}
                                onSave={val => saveHome({ ...home, title: val })}
                            />

                            <div className="editable-description">
                                <EditableField
                                    value={home.description}
                                    onSave={val =>
                                        saveHome({ ...home, description: val })
                                    }
                                    type="textarea"
                                    truncate={!expanded[home._id] ? 200 : 0}
                                />
                                {home.description.length > 200 && (
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

                            <EditableField
                                value={String(home.price)}
                                onSave={val =>
                                    saveHome({ ...home, price: Number(val) })
                                }
                                type="number"
                            />

                            <EditableField
                                value={String(home.capacity)}
                                onSave={val =>
                                    saveHome({ ...home, capacity: Number(val) })
                                }
                                type="number"
                            />

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
