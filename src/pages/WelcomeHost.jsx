import { useEffect, useState } from "react"
import { AirdndIcon } from '../cmps/AirdndIcon'
import { useNavigate, Link } from 'react-router-dom'
import { bookingService } from "../services/booking.service"
import { homeService } from "../services/home.service"
import { asArray } from "../services/util.service"
import { DashboardsCharts } from "../cmps/DashboardsCharts"
import {
    DollarSign,
    Heart,
    MessageSquare,
    Star,
    BookCheck,
    Home,
    XCircle,
} from "lucide-react"
import { utilService } from "../services/util.service"

export function WelcomeHost() {
    const navigate = useNavigate()
    const user = { _id: "68de5963d26a1ea2ad78f8b3", firstName: "Daria" }

    const [hostBookings, setHostBookings] = useState([])
    const [stats, setStats] = useState({
        income: 0,
        incomeThisMonth: 0,
        totalBookings: 0,
        upcomingBookings: 0,
        canceledByHost: 0,
        canceledByGuest: 0,
        homeRating: 0,
        wishlistCount: 0,
        activeListings: 0,
        newMessages: 35, // hardcoded for now
    })


    useEffect(() => {
        async function loadAllStats() {
            const bookingsRes = await bookingService.getHostBookings(user._id)
            console.log('bookingsRes:', bookingsRes)
            const bookings = asArray(bookingsRes)
            console.log('filtered bookings:', bookings)
            setHostBookings(bookings)

            const validBookings = bookings.filter(
                b => !["canceled-by-host", "canceled-by-guest"].includes(b.status.toLowerCase().replace(/\s+/g, "-"))
            )

            const totalBookings = bookings.length
            const upcomingBookings = bookings.filter(b => new Date(b.checkIn) > new Date()).length
            const totalEarnings = validBookings.reduce((sum, b) => sum + b.totalPrice, 0)

            // Earnings this month
            const now = new Date()
            const incomeThisMonth = validBookings
                .filter(b => {
                    const d = new Date(b.checkIn)
                    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
                })
                .reduce((sum, b) => sum + b.totalPrice, 0)

            const canceledByHost = bookings.filter(b => b.status.toLowerCase().replace(/\s+/g, "-") === "canceled-by-host").length
            const canceledByGuest = bookings.filter(b => b.status.toLowerCase().replace(/\s+/g, "-") === "canceled-by-guest").length

            // Homes
            const userHomesRes = await homeService.getHomesByHost(user._id)
            const userHomes = asArray(userHomesRes)
            console.log('userHomes:', userHomes)

            const ratings = userHomes.map(h => h.rating || 0)
            const avgRating = ratings.length
                ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
                : 0
                
            const wishlistCount = userHomes.reduce((sum, h) => sum + (h.addedToWishlist || 0), 0)
            const activeListings = userHomes.length

            setStats({
                income: totalEarnings,
                incomeThisMonth,
                totalBookings,
                upcomingBookings,
                canceledByHost,
                canceledByGuest,
                homeRating: avgRating,
                wishlistCount,
                activeListings,
                newMessages: 35, // hardcoded for now
            })
        }

        loadAllStats()
    }, [user._id])

    const addListingIcon = "/Airdnd/icons/add-listing.svg"
    const bookingIcon = "/Airdnd/icons/list-check-svgrepo-com.svg"
    const dashboardIcon = "/Airdnd/icons/dashboard-svgrepo-com.svg"
    const homesIcon = "/Airdnd/icons/home_icon2.svg"

    return (
        <section className="welcome-host">
            {/* Header */}
            <div className="welcome-header">
                <Link to="/" className="logo-link">
                    <AirdndIcon color="#000000" />
                </Link>
                <h1 className="welcome-title">Welcome back, {user.firstName}!</h1>
            </div>

            {/* Dashboard Stats */}
            <section className="welcome-dashboard-stats">

                {/* Bookings (Total + Upcoming) */}
                <div className="stat-card">
                    <p className="stat-title">Bookings</p>
                    <h2 className="stat-text">
                        Total: {stats.totalBookings} <br />
                        Upcoming: {stats.upcomingBookings}
                    </h2>
                    <div className="stat-icon"><BookCheck size={28} /></div>
                </div>

                {/* Earnings (Total + This Month) */}
                <div className="stat-card">
                    <p className="stat-title">Earnings</p>
                    <h2 className="stat-text">
                        Total: {Number(stats.income.toFixed(0)).toLocaleString()} $ <br />
                        {new Date().toLocaleString('en-US', { month: 'long' })}:{" "}
                        {Number(stats.incomeThisMonth.toFixed(0)).toLocaleString()} $
                    </h2>
                    <div className="stat-icon"><DollarSign size={28} /></div>
                </div>

                {/* Canceled (Host + Guest) */}
                <div className="stat-card">
                    <p className="stat-title">Canceled</p>
                    <h2 className="stat-text">
                        Host: {stats.canceledByHost} <br />
                        Guest: {stats.canceledByGuest}
                    </h2>
                    <div className="stat-icon"><XCircle size={28} /></div>
                </div>

                {/* Rating + Wishlist */}
                <div className="stat-card">
                    <p className="stat-title">Guest Experience</p>
                    <h2 className="stat-text">
                        Rating: {stats.homeRating.toFixed(1)} <br />
                        Wishlist: {stats.wishlistCount}
                    </h2>
                    <div className="stat-icon"><Star size={28} /></div>
                </div>

                {/* Active Listings + New Messages */}
                <div className="stat-card">
                    <p className="stat-title">Hosting Activity</p>
                    <h2 className="stat-text">
                        Listings: {stats.activeListings} <br />
                        Messages: {stats.newMessages}
                    </h2>
                    <div className="stat-icon"><MessageSquare size={28} /></div>
                </div>

            </section>

            {/* Listing container */}
            <div className="listing-container">
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
                <div className="listings">
                    <button className="create-btn" onClick={() => navigate("/host-listings")}>
                        <span className="icon">
                            <img src={homesIcon} alt="Homes icon" className="icon-gray-circle" />
                        </span>
                        View all listings
                    </button>
                </div>
            </div>
        </section>
    )
}
