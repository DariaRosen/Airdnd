import { useEffect, useState } from "react"
import { bookingService } from "../services/booking.service"
import { HostDashboardHeader } from "../cmps/HostDashboardHeader"
import { DashboardsCharts } from "../cmps/DashboardsCharts"

export function HostDashboard() {
    // Hardcoded logged-in user (replace with sessionStorage later)
    // const user = JSON.parse(sessionStorage.getItem("loggedinUser"))

    const user = {
        _id: "b1",
        firstName: "Harry",
        lastName: "Potter",
        username: "harry123",
        email: "harry@gmail.com",
    }

    const [hostBookings, setHostBookings] = useState([])

    useEffect(() => {
        async function loadBookings() {
            const bookings = await bookingService.getHostBookings(user._id)
            setHostBookings(bookings)
        }
        loadBookings()
    }, [user._id])

    // ✅ Filter out canceled bookings
    const validBookings = hostBookings.filter(
        b => b.status.toLowerCase() !== "canceled-by-host" &&
            b.status.toLowerCase() !== "canceled-by-guest"
    );

    // ✅ Calculate statistics
    const totalBookings = hostBookings.length
    const totalEarnings = validBookings.reduce((sum, res) => sum + res.totalPrice, 0)
    const avgPrice = totalBookings > 0 ? (totalEarnings / validBookings.length).toFixed(2) : 0
    const canceledByHost = hostBookings.filter(
        b => b.status.toLowerCase().replace(/\s+/g, "-") === "canceled-by-host"
    ).length

    const canceledByGuest = hostBookings.filter(
        b => b.status.toLowerCase().replace(/\s+/g, "-") === "canceled-by-guest"
    ).length

    const percentCanceledByHost = totalBookings ? ((canceledByHost / totalBookings) * 100).toFixed(1) : 0
    const percentCanceledByGuest = totalBookings ? ((canceledByGuest / totalBookings) * 100).toFixed(1) : 0

    const today = new Date()
    const upcoming = hostBookings.filter(res => new Date(res.checkIn) > today).length

    return (
        <section className="host-dashboard">
            <HostDashboardHeader logoText="Analysis Dashboard"/>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <p>Total Bookings</p>
                    <h2>{totalBookings}</h2>
                </div>
                <div className="stat-card">
                    <p>Upcoming Bookings</p>
                    <h2>{upcoming}</h2>
                </div>
                <div className="stat-card">
                    <p>Total Earnings</p>
                    <h2>${totalEarnings.toFixed(2)}</h2>
                </div>
                <div className="stat-card">
                    <p>Average per Booking</p>
                    <h2>${avgPrice}</h2>
                </div>
                <div className="stat-card">
                    <p>Canceled by Host</p>
                    <h2>{percentCanceledByHost}%</h2>
                </div>
                <div className="stat-card">
                    <p>Canceled by Guest</p>
                    <h2>{percentCanceledByGuest}%</h2>
                </div>
            </div>

            <div className="dashboard-charts-wrapper">
                <DashboardsCharts bookings={hostBookings} />
            </div>
        </section>
    )
}
