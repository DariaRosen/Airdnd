import { useEffect, useState } from "react";
import { homeService } from "../services/home.service"; // assumes you have a service to fetch homes
import { HostDashboardHeader } from "../cmps/HostDashboardHeader";

export function HostListings() {
    const [homes, setHomes] = useState([]);
    
    const user = {
        _id: "b1",
        firstName: "Harry",
        lastName: "Potter",
        username: "harry123",
        email: "harry@gmail.com",
    }
const hostId = user._id; // Replace with actual logged-in host ID
    useEffect(() => {
        async function loadHomes() {
            const allHomes = await homeService.query(); // fetch all homes
            const hostHomes = allHomes.filter((home) => home.host_id === hostId);
            setHomes(hostHomes);
        }
        loadHomes();
    }, [hostId]);

    return (
        <section className="host-listings">
            <HostDashboardHeader logoText="Add New Listing" />
            <div className="listings-grid">
                {homes.map((home) => (
                    <div key={home._id} className="listing-card">
                        <div
                            className="listing-avatar"
                            style={{ backgroundImage: `url(${home.imgUrls[0]})` }}
                        />
                        <div className="listing-info">
                            <h2>{home.title}</h2>
                            <p className="listing-location">
                                {home.location.city}, {home.location.country}
                            </p>
                            <p className="listing-price">${home.price} / night</p>
                            <p className="listing-details">
                                {home.capacity} guests · {home.rooms} rooms · {home.bathrooms} baths
                            </p>
                            <p className="listing-rating">
                                ⭐ {home.rating.toFixed(2)} ({home.numberOfRaters})
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
