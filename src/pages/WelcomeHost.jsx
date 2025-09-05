import { AirdndIcon } from '../cmps/AirdndIcon'
import { useNavigate } from 'react-router-dom'

export function WelcomeHost() {
    const navigate = useNavigate()
    const addListingIcon = "/Airdnd/icons/add-listing.svg"
    const bookingIcon = "/Airdnd/icons/list-check-svgrepo-com.svg"
    const dashboardIcon = "/Airdnd/icons/dashboard-svgrepo-com.svg"
    return (
        <section className="welcome-host">
            {/* Header */}
            <div className="welcome-header">
                <AirdndIcon color="#000000" />
                <div className="header-buttons">
                    <button className="questions-btn">Questions?</button>
                    <button
                        className="exit-btn"
                        onClick={() => navigate("/")} // ✅ Exit goes home
                    >
                        Exit
                    </button>
                </div>
            </div>

            {/* Listing container */}
            <div className="listing-container">
                <h1>Welcome back, Daria</h1>
                <div className="dashboard">
                    <button
                        className="create-btn"
                        onClick={() => navigate("/host-dashboard")}
                    >
                        <span className="icon">
                            <img
                                src={dashboardIcon}
                                alt="Dashboard icon"
                                className="icon-gray-circle"
                            />
                        </span>
                        Dashboard
                    </button>
                </div>

                <div className="bookings">
                    <button
                        className="create-btn"
                        onClick={() => navigate("/host-bookings")}
                    >
                        <span className="icon"> <img
                            src={bookingIcon}
                            alt="Bookings icon"
                            className="icon-gray-circle"
                        /></span> Bookings
                    </button>
                </div>

                <div className="new-listing">
                    <button className="create-btn">
                        <span className="icon"> <img
                            src={addListingIcon}
                            alt="Add Listing icon"
                            className="icon-gray-circle"
                        /></span> Create a new listing
                    </button>

                </div>
            </div>
        </section>
    );
}
