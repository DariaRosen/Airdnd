import { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export function DashboardsCharts({ bookings }) {
    const [barData, setBarData] = useState({ labels: [], datasets: [] });
    const [pieData, setPieData] = useState({ labels: [], datasets: [] });
    const [lineData, setLineData] = useState({ labels: [], datasets: [] });
    const [doughnutData, setDoughnutData] = useState({ labels: [], datasets: [] });
    const [revenuePerHomeData, setRevenuePerHomeData] = useState({ labels: [], datasets: [] });
    const [bookingWeekdayData, setBookingWeekdayData] = useState({ labels: [], datasets: [] });

    const currentYear = new Date().getFullYear();
    const [monthFilter, setMonthFilter] = useState(0);
    const [yearFilter, setYearFilter] = useState(currentYear);

    useEffect(() => {
        const monthlyIncome = Array(12).fill(0);
        const nightsCount = {};
        const bookingsByMonth = Array(12).fill(0);
        const statusCount = {};
        const revenuePerHome = {};
        const bookingsByWeekday = Array(7).fill(0);

        if (bookings && bookings.length > 0) {
            const allStatuses = [...new Set(bookings.map(b => b.status.toLowerCase()))];
            const allBookings = bookings;
            const validBookings = bookings.filter(b => {
                const status = b.status.toLowerCase();
                return !(
                    status.includes("cancel") // catches canceled, cancelled, cancelled-by-host, etc.
                );
            });

            // 🔵 Status breakdown → all bookings
            allBookings.forEach(b => {
                const status = b.status.toLowerCase();
                statusCount[status] = (statusCount[status] || 0) + 1;
            });

            // 🟢 Financial charts → valid bookings only
            validBookings.forEach(b => {
                const checkIn = new Date(b.checkIn);
                const checkOut = new Date(b.checkOut);
                const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

                const matchesYear = checkIn.getFullYear() === Number(yearFilter);
                const matchesMonth = monthFilter === 0 || checkIn.getMonth() + 1 === monthFilter;

                if (matchesYear && matchesMonth) {
                    monthlyIncome[checkIn.getMonth()] += b.totalPrice;
                    revenuePerHome[b.home_id] = (revenuePerHome[b.home_id] || 0) + b.totalPrice;
                    nightsCount[nights] = (nightsCount[nights] || 0) + 1;
                }
            });

            // 🟠 Demand charts → all bookings
            allBookings.forEach(b => {
                const checkIn = new Date(b.checkIn);
                const matchesYear = checkIn.getFullYear() === Number(yearFilter);
                const matchesMonth = monthFilter === 0 || checkIn.getMonth() + 1 === monthFilter;

                if (matchesYear && matchesMonth) {
                    bookingsByMonth[checkIn.getMonth()]++;
                    bookingsByWeekday[checkIn.getDay()]++;
                }
            });
        }

        setBarData({
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
                label: `Income ${yearFilter}${monthFilter ? " - Month " + monthFilter : ""}`,
                data: monthlyIncome,
                backgroundColor: "#27ae60"
            }]
        });

        setPieData({
            labels: Object.keys(nightsCount).map(n => `${n} Night${n > 1 ? "s" : ""}`),
            datasets: [{
                data: Object.values(nightsCount),
                backgroundColor: ["#2e86de", "#f39c12", "#27ae60", "#c0392b", "#d35400"]
            }]
        });

        setLineData({
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
                label: "Bookings",
                data: bookingsByMonth,
                borderColor: "#2e86de",
                backgroundColor: "#2e86de33",
                fill: true,
                tension: 0.4
            }]
        });

        setDoughnutData({
            labels: Object.keys(statusCount),
            datasets: [{
                data: Object.values(statusCount),
                backgroundColor: ["#27ae60", "#f39c12", "#2e86de", "#c0392b", "#d35400"]
            }]
        });

        setRevenuePerHomeData({
            labels: Object.keys(revenuePerHome),
            datasets: [{
                label: "Revenue per Home",
                data: Object.values(revenuePerHome),
                backgroundColor: "#2e86de"
            }]
        });

        setBookingWeekdayData({
            labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            datasets: [{
                label: "Bookings by Weekday",
                data: bookingsByWeekday,
                backgroundColor: "#f39c12"
            }]
        });
    }, [bookings, yearFilter, monthFilter]);

    const months = ["All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div className="dashboard-charts">
            <div className="charts-filters">
                <label>Year: </label>
                <input
                    type="number"
                    value={yearFilter}
                    onChange={e => setYearFilter(Number(e.target.value))}
                    style={{ width: "100px", margin: "0 1rem 0 0.5rem" }}
                />
                <label>Month: </label>
                <select value={monthFilter} onChange={e => setMonthFilter(Number(e.target.value))}>
                    {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
                </select>
            </div>

            <div
                className="charts-container"
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                    gap: "2rem",
                    justifyItems: "center",
                    marginTop: "1rem"
                }}
            >
                <div className="chart-card" style={{ maxWidth: "500px" }}>
                    <h3>Monthly Income</h3>
                    <Bar data={barData} options={{ responsive: true }} />
                </div>
                <div className="chart-card" style={{ maxWidth: "500px" }}>
                    <h3>Orders by Nights</h3>
                    <Pie data={pieData} options={{ responsive: true }} />
                </div>
                <div className="chart-card" style={{ maxWidth: "500px" }}>
                    <h3>Bookings Over Time</h3>
                    <Line data={lineData} options={{ responsive: true }} />
                </div>
                <div className="chart-card" style={{ maxWidth: "500px" }}>
                    <h3>Booking Status Breakdown</h3>
                    <Doughnut data={doughnutData} options={{ responsive: true }} />
                </div>
                <div className="chart-card" style={{ maxWidth: "500px" }}>
                    <h3>Revenue per Home</h3>
                    <Bar data={revenuePerHomeData} options={{ responsive: true }} />
                </div>
                <div className="chart-card" style={{ maxWidth: "500px" }}>
                    <h3>Booking Frequency by Weekday</h3>
                    <Bar data={bookingWeekdayData} options={{ responsive: true }} />
                </div>
            </div>
        </div>
    );
}
