import { useEffect, useState } from "react";
import { bookingService } from "../services/booking.service";
import { HostDashboardHeader } from "../cmps/HostDashboardHeader";

export function HostReservations() {
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
        reservationId: "",
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

    // Support function: calculate number of days reserved
    const getDaysReserved = (checkIn, checkOut) => {
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);
        const diffTime = outDate - inDate;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Filtering
    const filteredBookings = hostBookings.filter((b) => {
        return (
            b.guest_id.toLowerCase().includes(filters.guestId.toLowerCase()) &&
            b._id.toLowerCase().includes(filters.reservationId.toLowerCase()) &&
            b.home_id.toLowerCase().includes(filters.homeId.toLowerCase())
        );
    });

    // Sorting
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
        <section className="host-bookings">
            <HostDashboardHeader />
            <h1>Host Bookings</h1>

            <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
                <input
                    type="text"
                    name="guestId"
                    placeholder="Filter by Guest ID"
                    value={filters.guestId}
                    onChange={handleFilterChange}
                />
                <input
                    type="text"
                    name="reservationId"
                    placeholder="Filter by Reservation ID"
                    value={filters.reservationId}
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

            <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th onClick={() => handleSort("status")}>Status</th>
                        <th onClick={() => handleSort("_id")}>Reservation ID</th>
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
                            <td>{b.status}</td> {/* Status first */}
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
        </section>
    );
}
