import { AirdndIcon } from '../cmps/AirdndIcon'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {
    PlusCircle,
    CalendarCheck2,
    LayoutDashboard,
    DollarSign,
    Heart,
    MessageSquare,
    Star,
    BookCheck,
    Home,
    XCircle,
    Clock
} from "lucide-react"

export function WelcomeHost() {
    const navigate = useNavigate()
    const addListingIcon = "/Airdnd/icons/add-listing.svg"
    const bookingIcon = "/Airdnd/icons/list-check-svgrepo-com.svg"
    const dashboardIcon = "/Airdnd/icons/dashboard-svgrepo-com.svg"
    return (
        <section className="welcome-host">
            {/* Header */}
            <div className="welcome-header">
                <Link to="/" className="logo-link">
                    <AirdndIcon color="#000000" />
                </Link>

                <div className="header-buttons">
                    <button className="questions-btn">Questions?</button>
                    <button
                        className="exit-btn"
                        onClick={() => navigate("/")}
                    >
                        Exit
                    </button>
                </div>
            </div>
            {/* Dashboard Stats */}
            <section className="welcome-dashboard-stats">
                <div className="stat-card">
                    <div className="stat-text">
                        <p>This month income</p>
                        <h2>$13,420 <span className="positive">+67%</span></h2>
                    </div>
                    <div className="stat-icon"><DollarSign size={28} /></div>
                </div>

                <div className="stat-card">
                    <div className="stat-text">
                        <p>Added to wishlist</p>
                        <h2>67 <span className="positive">+18%</span></h2>
                    </div>
                    <div className="stat-icon"><Heart size={28} /></div>
                </div>

                <div className="stat-card">
                    <div className="stat-text">
                        <p>New Messages</p>
                        <h2>35</h2>
                    </div>
                    <div className="stat-icon"><MessageSquare size={28} /></div>
                </div>

                <div className="stat-card">
                    <div className="stat-text">
                        <p>Rating</p>
                        <h2>4.9 <span className="positive">+12%</span></h2>
                    </div>
                    <div className="stat-icon"><Star size={28} /></div>
                </div>

                <div className="stat-card">
                    <div className="stat-text">
                        <p>Total Bookings</p>
                        <h2>240 <span className="positive">+21%</span></h2>
                    </div>
                    <div className="stat-icon"><BookCheck size={28} /></div>
                </div>

                <div className="stat-card">
                    <div className="stat-text">
                        <p>Active Listings</p>
                        <h2>12</h2>
                    </div>
                    <div className="stat-icon"><Home size={28} /></div>
                </div>

                <div className="stat-card">
                    <div className="stat-text">
                        <p>Cancellation Rate</p>
                        <h2>2% <span className="negative">-1%</span></h2>
                    </div>
                    <div className="stat-icon"><XCircle size={28} /></div>
                </div>

            </section>
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

                <div className="listing">
                    <button
                        className="create-btn"
                        onClick={() => navigate("/host-listing")}
                    >
                        <span className="icon"> <img
                            src={addListingIcon}
                            alt="Add Listing icon"
                            className="icon-gray-circle"
                        /></span> Create a new listing
                    </button>
                </div>
            </div>
        </section>
    )
}
