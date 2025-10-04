import { useEffect, useState } from "react"
import { bookingService } from "../services/booking.service"
import { HostDashboardHeader } from "../cmps/HostDashboardHeader"
import { DashboardsCharts } from "../cmps/DashboardsCharts"
import { asArray } from "../services/util.service"

export function HostDashboard() {
    // Hardcoded logged-in user (replace with sessionStorage later)
    // const user = JSON.parse(sessionStorage.getItem("loggedinUser"))

    const user = {
        _id: "68de5963d26a1ea2ad78f8b3",
        firstName: "Daria",
        lastName: "Rosen",
        username: "daria123",
        email: "daria@gmail.com",
    }


    const [hostBookings, setHostBookings] = useState([])

    useEffect(() => {
        async function loadBookings() {
            const bookingsRes = await bookingService.getHostBookings(user._id)
            const bookings = asArray(bookingsRes)
            setHostBookings(bookings)
        }
        loadBookings()
    }, [user._id])



    return (
        <section className="host-dashboard">
            <HostDashboardHeader logoText="Analysis Dashboard" />

            <div className="dashboard-charts-wrapper">
                <DashboardsCharts bookings={hostBookings} />
            </div>
        </section>
    )
}
