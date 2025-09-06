import { useState } from "react"
import { HostDashboardHeader } from "../cmps/HostDashboardHeader"
import { AmenitySelector } from "../cmps/AmenitySelector"
import { ImageUploader } from "../cmps/ImageUploader"

export function HostListing() {
    const [amenities, setAmenities] = useState([])
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
                        <div className="price-input">
                            <input type="number" placeholder="Enter price" />
                            <select>
                                <option value="NIS">NIS</option>
                                <option value="USD">USD</option>
                                <option value="CAD">CAD</option>
                                <option value="EUR">EURO</option>
                            </select>
                        </div>                    </label>

                    <div className="property-details-row">
                        <label>
                            Capacity:
                            <input type="number" placeholder="e.g. 4" />
                        </label>
                        <label>
                            Rooms:
                            <input type="number" placeholder="e.g. 3" />
                        </label>
                        <label>
                            Beds:
                            <input type="number" placeholder="e.g. 3" />
                        </label>
                        <label>
                            Bathrooms:
                            <input type="number" placeholder="e.g. 2" />
                        </label>
                        <label>
                            Type:
                            <select>
                                <option value="house">House</option>
                                <option value="apartment">Apartment</option>
                                <option value="villa">Villa</option>
                                <option value="cabin">Cabin</option>
                            </select>
                        </label>
                    </div>


                    <h2>Select Amenities</h2>
                    <AmenitySelector amenities={amenities} setAmenities={setAmenities} />
                    <p>Location: {amenities.join(", ")}</p>

                    <fieldset>
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
                        <p>Images:</p>
                        <ImageUploader
                            onImagesChange={(files) => {
                                setForm(prev => ({ ...prev, imgUrls: files }))
                            }}
                        />
                    </fieldset>

                    <button type="submit">Create Listing</button>
                </form>
            </div>
        </section>
    )
}
