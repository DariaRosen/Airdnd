import { useEffect } from "react"
import { useSelector } from "react-redux"
import { HostDashboardHeader } from "../cmps/HostDashboardHeader"
import { DashboardsCharts } from "../cmps/DashboardsCharts"
import { loadHostBookings } from "../store/booking/booking.action"

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
    const bookings = useSelector((state) => state.bookingModule.bookings)
    const isLoading = useSelector((state) => state.bookingModule.isLoading)

    useEffect(() => {
        loadHostBookings(user._id)
    }, [user._id])

    return (
        <section className="host-dashboard">
            <HostDashboardHeader logoText="Analysis Dashboard" />

            <div className="dashboard-charts-wrapper">
                {isLoading ? (
                    <div className="spinner"></div>
                ) : (
                    <DashboardsCharts bookings={bookings.items || []} />
                )}
            </div>
        </section>
    )
}
