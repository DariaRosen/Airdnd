import { useState } from "react"
import { HostDashboardHeader } from "../cmps/HostDashboardHeader"

const ALL_AMENITIES = [
    "WiFi",
    "Fireplace",
    "Garden",
    "Washer",
    "TV",
    "Balcony",
    "Kitchen",
    "AC",
]

export function HostListing() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        capacity: "",
        rooms: "",
        beds: "",
        bathrooms: "",
        type: "house",
        imgUrls: [""],
        rating: 0,
        numberOfRaters: 0,
        guestFavorite: false,
        location: {
            country: "",
            city: "",
            address: "",
            lat: "",
            lng: "",
        },
        amenities: [],
    })

    function handleChange(ev) {
        const { name, value } = ev.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    function handleLocationChange(ev) {
        const { name, value } = ev.target
        setForm((prev) => ({
            ...prev,
            location: { ...prev.location, [name]: value },
        }))
    }

    function handleAmenityToggle(amenity) {
        setForm((prev) => {
            const exists = prev.amenities.includes(amenity)
            return {
                ...prev,
                amenities: exists
                    ? prev.amenities.filter((a) => a !== amenity)
                    : [...prev.amenities, amenity],
            }
        })
    }

    function handleImgChange(idx, value) {
        setForm((prev) => {
            const imgUrls = [...prev.imgUrls]
            imgUrls[idx] = value
            return { ...prev, imgUrls }
        })
    }

    function addImageField() {
        setForm((prev) => ({ ...prev, imgUrls: [...prev.imgUrls, ""] }))
    }

    function handleSubmit(ev) {
        ev.preventDefault()
        console.log("New Listing:", form)
        // Here call your homeService / API to save the new listing
    }

    return (
        <section className="host-listing">
            <HostDashboardHeader />
            <div className="new-listing">
                <h2>Add New Listing</h2>

                <form className="listing-form" onSubmit={handleSubmit}>
                    <label>
                        Title:
                        <input type="text" name="title" value={form.title} onChange={handleChange} required />
                    </label>

                    <label>
                        Description:
                        <textarea name="description" value={form.description} onChange={handleChange} required />
                    </label>

                    <label>
                        Price (per night):
                        <input type="number" name="price" value={form.price} onChange={handleChange} required />
                    </label>

                    <label>
                        Capacity:
                        <input type="number" name="capacity" value={form.capacity} onChange={handleChange} required />
                    </label>

                    <label>
                        Rooms:
                        <input type="number" name="rooms" value={form.rooms} onChange={handleChange} />
                    </label>

                    <label>
                        Beds:
                        <input type="number" name="beds" value={form.beds} onChange={handleChange} />
                    </label>

                    <label>
                        Bathrooms:
                        <input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} />
                    </label>

                    <label>
                        Type:
                        <select name="type" value={form.type} onChange={handleChange}>
                            <option value="house">House</option>
                            <option value="apartment">Apartment</option>
                            <option value="cabin">Cabin</option>
                            <option value="villa">Villa</option>
                        </select>
                    </label>

                    <fieldset>
                        <legend>Amenities</legend>
                        {ALL_AMENITIES.map((amenity) => (
                            <label key={amenity} style={{ display: "block" }}>
                                <input
                                    type="checkbox"
                                    checked={form.amenities.includes(amenity)}
                                    onChange={() => handleAmenityToggle(amenity)}
                                />
                                {amenity}
                            </label>
                        ))}
                    </fieldset>

                    <fieldset>
                        <legend>Location</legend>
                        <input
                            type="text"
                            placeholder="Country"
                            name="country"
                            value={form.location.country}
                            onChange={handleLocationChange}
                            required
                        />
                        <input
                            type="text"
                            placeholder="City"
                            name="city"
                            value={form.location.city}
                            onChange={handleLocationChange}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Address"
                            name="address"
                            value={form.location.address}
                            onChange={handleLocationChange}
                        />
                        <input
                            type="number"
                            placeholder="Latitude"
                            name="lat"
                            value={form.location.lat}
                            onChange={handleLocationChange}
                        />
                        <input
                            type="number"
                            placeholder="Longitude"
                            name="lng"
                            value={form.location.lng}
                            onChange={handleLocationChange}
                        />
                    </fieldset>

                    <fieldset>
                        <legend>Images</legend>
                        {form.imgUrls.map((url, idx) => (
                            <input
                                key={idx}
                                type="url"
                                placeholder={`Image URL ${idx + 1}`}
                                value={url}
                                onChange={(ev) => handleImgChange(idx, ev.target.value)}
                            />
                        ))}
                        <button type="button" onClick={addImageField}>+ Add another image</button>
                    </fieldset>

                    <button type="submit">Create Listing</button>
                </form>
            </div>
        </section>
    )
}
