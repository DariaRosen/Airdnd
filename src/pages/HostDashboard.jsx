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



    return (
        <section className="host-dashboard">
            <HostDashboardHeader logoText="Analysis Dashboard"/>

            <div className="dashboard-charts-wrapper">
                <DashboardsCharts bookings={hostBookings} />
            </div>
        </section>
    )
}
