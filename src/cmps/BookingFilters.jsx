import { useState, useEffect } from "react";

export function BookingFilters({ filters, onChange }) {
    const [localFilters, setLocalFilters] = useState(filters);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updated = { ...localFilters, [name]: value };
        setLocalFilters(updated);
        onChange(updated);
    };

    // Generate year options dynamically
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];


    return (
        <div className="booking-filters">
            <select name="status" value={localFilters.status} onChange={handleChange}>
                <option value="">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="New">New</option>
                <option value="Canceled by Guest">Canceled by Guest</option>
                <option value="Canceled by Host">Canceled by Host</option>
            </select>

            <select name="year" value={localFilters.year} onChange={handleChange}>
                <option value="">All Years</option>
                {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                ))}
            </select>

            <select name="month" value={localFilters.month} onChange={handleChange}>
                <option value="">All Months</option>
                {months.map((m, index) => (
                    <option key={index} value={index + 1}>{m}</option> // value = 1–12
                ))}
            </select>

            <input
                type="text"
                name="guestId"
                placeholder="Guest ID"
                value={localFilters.guestId}
                onChange={handleChange}
            />
            <input
                type="text"
                name="bookingId"
                placeholder="Booking ID"
                value={localFilters.bookingId}
                onChange={handleChange}
            />
            <input
                type="text"
                name="homeId"
                placeholder="Home ID"
                value={localFilters.homeId}
                onChange={handleChange}
            />
        </div>
    );
}
