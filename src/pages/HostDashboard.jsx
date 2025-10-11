import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { HostDashboardHeader } from "../cmps/HostDashboardHeader"
import { DashboardsCharts } from "../cmps/DashboardsCharts"
import { loadHostBookings } from "../store/booking/booking.action"
import { userService } from "../services/user.service"
import { useNavigate } from "react-router-dom"

export function HostDashboard() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)

    const bookings = useSelector(state => state.bookingModule.bookings)
    const isLoading = useSelector(state => state.bookingModule.isLoading)

    // Load logged-in user
    useEffect(() => {
        const loggedinUser = userService.getLoggedinUser()
        if (!loggedinUser) {
            navigate("/login") // redirect if not logged in
        } else {
            setUser(loggedinUser)
        }
    }, [navigate])

    // Load host bookings once user is available
    useEffect(() => {
        if (!user) return
        loadHostBookings(user._id) // call action directly
    }, [user])

    if (!user) return <p>Loading...</p>

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
