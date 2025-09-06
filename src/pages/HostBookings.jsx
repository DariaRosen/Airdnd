import { useEffect, useState } from "react";
import { bookingService } from "../services/booking.service";
import { HostDashboardHeader } from "../cmps/HostDashboardHeader";

export function HostBookings() {
    const user = {
        _id: "b1",
        firstName: "Harry",
        lastName: "Potter",
        username: "harry123",
        email: "harry@gmail.com",
    };

    const [hostBookings, setHostBookings] = useState([]);
    const [filters, setFilters] = useState({
        guestId: "",
        bookingId: "",
        homeId: ""
    });
    const [sortKey, setSortKey] = useState("checkIn");
    const [sortOrder, setSortOrder] = useState("asc");

    useEffect(() => {
        async function loadBookings() {
            const bookings = await bookingService.getHostBookings(user._id);
            setHostBookings(bookings);
        }
        loadBookings();
    }, [user._id]);

    // Calculate days reserved
    const getDaysReserved = (checkIn, checkOut) => {
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);
        const diffTime = outDate - inDate;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Filter bookings
    const filteredBookings = hostBookings.filter((b) => {
        return (
            b.guest_id.toLowerCase().includes(filters.guestId.toLowerCase()) &&
            b._id.toLowerCase().includes(filters.bookingId.toLowerCase()) &&
            b.home_id.toLowerCase().includes(filters.homeId.toLowerCase())
        );
    });

    // Sort bookings
    const sortedBookings = [...filteredBookings].sort((a, b) => {
        if (sortKey === "checkIn" || sortKey === "checkOut") {
            const dateA = new Date(a[sortKey]);
            const dateB = new Date(b[sortKey]);
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        } else if (sortKey === "totalPrice" || sortKey === "daysReserved") {
            const valA = sortKey === "daysReserved" ? getDaysReserved(a.checkIn, a.checkOut) : a[sortKey];
            const valB = sortKey === "daysReserved" ? getDaysReserved(b.checkIn, b.checkOut) : b[sortKey];
            return sortOrder === "asc" ? valA - valB : valB - valA;
        } else if (sortKey === "status") {
            return sortOrder === "asc"
                ? a.status.localeCompare(b.status)
                : b.status.localeCompare(a.status);
        } else {
            return sortOrder === "asc"
                ? a[sortKey].localeCompare(b[sortKey])
                : b[sortKey].localeCompare(a[sortKey]);
        }
    });

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <section className="bookings">
            <HostDashboardHeader />
            <div className="host-bookings">
                <h1>Host Bookings</h1>

                <div className="filters">
                    <input
                        type="text"
                        name="guestId"
                        placeholder="Filter by Guest ID"
                        value={filters.guestId}
                        onChange={handleFilterChange}
                    />
                    <input
                        type="text"
                        name="bookingId"
                        placeholder="Filter by Booking ID"
                        value={filters.bookingId}
                        onChange={handleFilterChange}
                    />
                    <input
                        type="text"
                        name="homeId"
                        placeholder="Filter by Home ID"
                        value={filters.homeId}
                        onChange={handleFilterChange}
                    />
                </div>

                <table className="bookings-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort("status")}>Status</th>
                            <th onClick={() => handleSort("_id")}>Booking ID</th>
                            <th onClick={() => handleSort("home_id")}>Home ID</th>
                            <th onClick={() => handleSort("guest_id")}>Guest ID</th>
                            <th onClick={() => handleSort("checkIn")}>Check In</th>
                            <th onClick={() => handleSort("checkOut")}>Check Out</th>
                            <th onClick={() => handleSort("daysReserved")}>Days Reserved</th>
                            <th onClick={() => handleSort("totalPrice")}>Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedBookings.map((b) => (
                            <tr key={b._id}>
                                <td className={`status-${b.status.toLowerCase().replace(/ /g, "-")}`}>
                                    {b.status}
                                </td>
                                <td>{b._id}</td>
                                <td>{b.home_id}</td>
                                <td>{b.guest_id}</td>
                                <td>{b.checkIn}</td>
                                <td>{b.checkOut}</td>
                                <td>{getDaysReserved(b.checkIn, b.checkOut)}</td>
                                <td>${b.totalPrice.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
