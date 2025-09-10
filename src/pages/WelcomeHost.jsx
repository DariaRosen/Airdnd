import { useEffect, useState } from "react"
import { AirdndIcon } from '../cmps/AirdndIcon'
import { useNavigate, Link } from 'react-router-dom'
import { bookingService } from "../services/booking.service"
import { homeService } from "../services/home.service"
import {
    DollarSign,
    Heart,
    MessageSquare,
    Star,
    BookCheck,
    Home,
    XCircle,
} from "lucide-react"

export function WelcomeHost() {
    const navigate = useNavigate()
    const user = { _id: "b1", firstName: "Harry" }

    const [stats, setStats] = useState({
        income: 0,
        incomeChange: 0,
        totalBookings: 0,
        totalBookingsChange: 0,
        cancellationRate: 0,
        cancellationChange: 0,
        wishlistCount: 0,
        activeListings: 0,
        homeRating: 0,
    })

    useEffect(() => {
        async function loadAllStats() {
            // Host bookings
            const bookings = await bookingService.getHostBookings(user._id)

            // Trends (income, cancellation, bookings)
            const trends = bookingService.calculateTrends(bookings)
            console.log("trends", trends);

            // Homes
            const userHomes = await homeService.getHomesByHost(user._id)
            console.log("userHomes", userHomes);

            // Average rating
            const ratings = await Promise.all(userHomes.map(home => homeService.getHomeRating(home._id)))
            const validRatings = ratings.filter(r => typeof r === 'number')
            const avgRating = validRatings.length
                ? validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length
                : 0

            // Wishlist count & active listings
            const wishlistCount = userHomes.reduce((sum, h) => sum + (h.addedToWishlist || 0), 0)
            const activeListings = userHomes.length

            setStats({
                ...trends,
                homeRating: avgRating,
                wishlistCount,
                activeListings,
                totalBookings: bookings.length // total bookings ever
            })
        }

        loadAllStats()
    }, [user._id])


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
                        <p>Income</p>
                        <h2>
                            ${stats.income.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                            <span className={stats.incomeChange >= 0 ? "positive" : "negative"}>
                                {Math.round(stats.incomeChange)}%
                            </span>
                        </h2>
                    </div>
                    <div className="stat-icon"><DollarSign size={28} /></div>
                </div>

                <div className="stat-card">
                    <div className="stat-text">
                        <p>Added to wishlist</p>
                        <h2>{stats.wishlistCount}</h2>
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
                        <h2>{stats.homeRating.toFixed(1)}</h2>
                    </div>
                    <div className="stat-icon"><Star size={28} /></div>
                </div>

                <div className="stat-card">
                    <div className="stat-text">
                        <p>Total Bookings</p>
                        <h2>
                            {stats.totalBookings}
                            <span className={stats.totalBookingsChange >= 0 ? "positive" : "negative"}>
                                {Math.round(stats.totalBookingsChange)}%
                            </span>
                        </h2>
                    </div>
                    <div className="stat-icon"><BookCheck size={28} /></div>
                </div>

                <div className="stat-card">
                    <div className="stat-text">
                        <p>Active Listings</p>
                        <h2>{stats.activeListings}</h2>
                    </div>
                    <div className="stat-icon"><Home size={28} /></div>
                </div>

                <div className="stat-card">
                    <div className="stat-text">
                        <p>Cancellation Rate</p>
                        <h2>
                            {stats.cancellationRate.toFixed(1)}%
                            <span className={stats.cancellationChange >= 0 ? "negative" : "positive"}>
                                {Math.round(stats.cancellationChange)}%
                            </span>
                        </h2>
                    </div>
                    <div className="stat-icon"><XCircle size={28} /></div>
                </div>
            </section>

            {/* Listing container */}
            <div className="listing-container">
                <h1>Welcome back, Daria</h1>

                <div className="dashboard">
                    <button className="create-btn" onClick={() => navigate("/host-dashboard")}>
                        <span className="icon">
                            <img src={dashboardIcon} alt="Dashboard icon" className="icon-gray-circle" />
                        </span>
                        Dashboard
                    </button>
                </div>

                <div className="bookings">
                    <button className="create-btn" onClick={() => navigate("/host-bookings")}>
                        <span className="icon">
                            <img src={bookingIcon} alt="Bookings icon" className="icon-gray-circle" />
                        </span>
                        Bookings
                    </button>
                </div>

                <div className="listing">
                    <button className="create-btn" onClick={() => navigate("/host-listing")}>
                        <span className="icon">
                            <img src={addListingIcon} alt="Add Listing icon" className="icon-gray-circle" />
                        </span>
                        Create a new listing
                    </button>
                </div>
            </div>
        </section>
    )
}
