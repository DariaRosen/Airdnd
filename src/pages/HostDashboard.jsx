import { useEffect, useState } from "react"
import { bookingService } from "../services/booking.service"
import { HostDashboardHeader } from "../cmps/HostDashboardHeader"
import { DashboardsCharts } from "../cmps/DashboardsCharts";

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
            console.log("bookings", bookings);

            setHostBookings(bookings)
        }
        loadBookings()
    }, [user._id])


    // ✅ Calculate statistics
    const totalBookings = hostBookings.length
    const totalEarnings = hostBookings.reduce((sum, res) => sum + res.totalPrice, 0)
    const avgPrice = totalBookings > 0 ? (totalEarnings / totalBookings).toFixed(2) : 0

    const today = new Date()
    const upcoming = hostBookings.filter(res => new Date(res.checkIn) > today).length

    return (
        <section className="host-dashboard">
            <HostDashboardHeader />
            <h1>Host Dashboard</h1>

            <div className="stats">
                <DashboardsCharts bookings={hostBookings} />
                <p><strong>Total Bookings:</strong> {totalBookings}</p>
                <p><strong>Upcoming Bookings:</strong> {upcoming}</p>
                <p><strong>Total Earnings:</strong> ${totalEarnings.toFixed(2)}</p>
                <p><strong>Average per Booking:</strong> ${avgPrice}</p>
            </div>
        </section>
    )
}
