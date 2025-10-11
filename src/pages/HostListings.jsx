import { useEffect, useState } from "react"
import { homeService } from "../services/home.service"
import { HostDashboardHeader } from "../cmps/HostDashboardHeader"
import { Pencil } from "lucide-react" // install lucide-react if not already
import { userService } from "../services/user.service"
import { useNavigate } from "react-router-dom"

export function HostListings() {
    const navigate = useNavigate()
    const [homes, setHomes] = useState([])
    const [expanded, setExpanded] = useState({}) // track expanded descriptions
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Load logged-in user
    useEffect(() => {
        const loggedinUser = userService.getLoggedinUser()
        if (!loggedinUser) {
            navigate("/login") // redirect if not logged in
        } else {
            setUser(loggedinUser)
        }
        setLoading(false)
    }, [navigate])

    // Load homes for host
    useEffect(() => {
        if (!user) return

        async function loadHomes() {
            try {
                const allHomes = await homeService.query()
                const hostHomes = allHomes
                    .map(homeService.normalize)
                    .filter(home => home.hostId === user._id)

                setHomes(hostHomes) // full homes with all fields intact
            } catch (err) {
                console.error("Failed to load homes", err)
            }
        }

        loadHomes()
    }, [user])

    async function saveHome(updatedHome) {
        try {
            const saved = await homeService.save(updatedHome) // returns normalized home
            setHomes(prev => prev.map(h => (h._id === saved._id ? saved : h)))
        } catch (err) {
            console.error("Failed to save home", err)
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

    if (loading) return <p>Loading...</p>
    if (!user) return null

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
                                    onSave={val => saveHome({ ...home, description: val })}
                                    type="textarea"
                                    truncate={!expanded[home._id] ? 60 : 0}
                                />
                                {home.description.length > 60 && (
                                    <button
                                        type="button"
                                        className="show-more-btn"
                                        onClick={() => toggleExpand(home._id)}
                                    >
                                        {expanded[home._id] ? "Show less" : "Show more"}
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
                                    onSave={val => saveHome({ ...home, capacity: Number(val) })}
                                    type="number"
                                />
                            </div>

                            <p className="listing-rating">
                                ⭐ {home.rating?.toFixed(2)} ({home.numberOfRaters ?? 0})
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
