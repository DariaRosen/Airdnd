import { useEffect, useState } from "react";
import { bookingService } from "../services/booking.service";
import { HostDashboardHeader } from "../cmps/HostDashboardHeader";
import { BookingFilters } from "../cmps/BookingFilters";
import { utilService } from "../services/util.service";
import { asArray } from "../services/util.service";

export function HostBookings() {
    const user = { _id: "68c242e0ac0d57e02713467f", firstName: "Harry" };

    const [hostBookings, setHostBookings] = useState([]);
    const [filters, setFilters] = useState({
        guestId: "",
        bookingId: "",
        homeId: "",
        status: "",
        year: "",
        month: "",
    });
    const [sortKey, setSortKey] = useState("checkIn");
    const [sortOrder, setSortOrder] = useState("asc");

    useEffect(() => {
        async function loadBookings() {
            const bookingsRes = await bookingService.getHostBookings(user._id);
            const bookings = asArray(bookingsRes)


            // Remove duplicates by _id
            const uniqueBookings = [...new Map(bookings.map(b => [b._id, b])).values()];
            setHostBookings(uniqueBookings);
        }
        loadBookings();
    }, [user._id]);

    const getDaysReserved = (checkIn, checkOut) => {
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);
        return Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24));
    };

    const filteredBookings = hostBookings.filter((b) => {
        const bDate = new Date(b.checkIn);
        return (
            (!filters.guestId || b.guest_id.toLowerCase().includes(filters.guestId.toLowerCase())) &&
            (!filters.bookingId || b._id.toLowerCase().includes(filters.bookingId.toLowerCase())) &&
            (!filters.homeId || b.home_id.toLowerCase().includes(filters.homeId.toLowerCase())) &&
            (!filters.status || b.status.toLowerCase() === filters.status.toLowerCase()) &&
            (!filters.year || bDate.getFullYear() === parseInt(filters.year)) &&
            (!filters.month || bDate.getMonth() + 1 === parseInt(filters.month))
        );
    });

    const sortedBookings = [...filteredBookings].sort((a, b) => {
        if (sortKey === "checkIn" || sortKey === "checkOut") {
            return sortOrder === "asc"
                ? new Date(a[sortKey]) - new Date(b[sortKey])
                : new Date(b[sortKey]) - new Date(a[sortKey]);
        } else if (sortKey === "totalPrice" || sortKey === "daysReserved") {
            const valA = sortKey === "daysReserved" ? getDaysReserved(a.checkIn, a.checkOut) : a[sortKey];
            const valB = sortKey === "daysReserved" ? getDaysReserved(b.checkIn, b.checkOut) : b[sortKey];
            return sortOrder === "asc" ? valA - valB : valB - valA;
        } else if (sortKey === "status") {
            return sortOrder === "asc" ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
        } else {
            return sortOrder === "asc" ? a[sortKey].localeCompare(b[sortKey]) : b[sortKey].localeCompare(a[sortKey]);
        }
    });

    const handleSort = (key) => {
        if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    const handleStatusChange = async (bookingId, newStatus) => {
        try {
            // Call your booking service to update the status in the backend
            await bookingService.updateBookingStatus(bookingId, newStatus);

            // Update the local state so UI refreshes
            setHostBookings(prev =>
                prev.map(b => (b._id === bookingId ? { ...b, status: newStatus } : b))
            );
        } catch (err) {
            console.error("Failed to update status:", err);
            alert("Could not update status, try again.");
        }
    };


    return (
        <section className="host-bookings">
            <HostDashboardHeader logoText="Host Bookings" />

            <div className="filters-wrapper">
                <BookingFilters filters={filters} onChange={setFilters} />
            </div>

            <div className="table-card">
                <table className="bookings-table">
                    <thead>
                        <tr>
                            <th>Actions</th>
                            {[
                                { key: "status", label: "Status" },
                                { key: "_id", label: "Booking ID" },
                                { key: "home_id", label: "Home ID" },
                                { key: "guest_id", label: "Guest ID" },
                                { key: "checkIn", label: "Check In" },
                                { key: "checkOut", label: "Check Out" },
                                { key: "totalPrice", label: "Total Price" },
                            ].map((col) => (
                                <th
                                    key={col.key}
                                    className="sortable"
                                    onClick={() => handleSort(col.key)}
                                >
                                    <div className="th-content">
                                        <span className="col-label">{col.label}</span>
                                        <span className="sort-indicator">
                                            <span
                                                className={`asc ${sortKey === col.key && sortOrder === "asc" ? "active" : ""
                                                    }`}
                                            >
                                                ▲
                                            </span>
                                            <span
                                                className={`desc ${sortKey === col.key && sortOrder === "desc" ? "active" : ""
                                                    }`}
                                            >
                                                ▼
                                            </span>
                                        </span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {sortedBookings.map((b) => (
                            <tr key={b._id}>
                                <td>
                                    {b.status.toLowerCase() === "new" ||
                                        b.status.toLowerCase() === "pending" ? (
                                        <div className="status-actions">
                                            <button
                                                className="approve-btn"
                                                onClick={() => handleStatusChange(b._id, "Paid")}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="reject-btn"
                                                onClick={() =>
                                                    handleStatusChange(b._id, "Canceled by Host")
                                                }
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="status-gray">
                                            {b.status.toLowerCase() === "paid"
                                                ? "Approved"
                                                : "Canceled"}
                                        </span>
                                    )}
                                </td>
                                <td>
                                    <span
                                        className={`status-pill status-${b.status
                                            .toLowerCase()
                                            .replace(/ /g, "-")}`}
                                    >
                                        {b.status}
                                    </span>
                                </td>
                                <td>{b._id}</td>
                                <td>{b.home_id}</td>
                                <td>{b.guest_id}</td>
                                <td>{utilService.formatDate(b.checkIn)}</td>
                                <td>{utilService.formatDate(b.checkOut)}</td>
                                <td>${b.totalPrice.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

    );
}
