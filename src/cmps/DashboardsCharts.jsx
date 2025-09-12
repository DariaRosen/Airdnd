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

// Airbnb color palette
export const airbnbColors = {
    primaryPink: "#ff385c",
    gray: "#6a6a6a",
    dark: "#222222",
    lightGray: "#ebebeb",
    white: "#ffffff",
    pastel: ["#ff385c", "#ffb4c0", "#e7ce8aff", "#94c2f1ff", "#8de4b1ff", "#f08599ff"],
};

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

    // Global chart options for Airbnb modern look
    const baseChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: airbnbColors.dark,
                    font: { size: 12, weight: 500 },
                },
            },
            tooltip: {
                backgroundColor: "rgba(34,34,34,0.9)",
                titleColor: "#fff",
                bodyColor: "#fff",
                borderColor: airbnbColors.primaryPink,
                borderWidth: 1,
                cornerRadius: 5,
                padding: 10,
            },
        },
        scales: {
            x: {
                grid: { color: airbnbColors.lightGray },
                ticks: { color: airbnbColors.gray, font: { size: 12 } },
            },
            y: {
                grid: { color: airbnbColors.lightGray },
                ticks: { color: airbnbColors.gray, font: { size: 12 } },
            },
        },
    };

    useEffect(() => {
        const monthlyIncome = Array(12).fill(0);
        const nightsCount = {};
        const bookingsByMonth = Array(12).fill(0);
        const statusCount = {};
        const revenuePerHome = {};
        const bookingsByWeekday = Array(7).fill(0);

        if (bookings?.length) {
            const validBookings = bookings.filter(b => !b.status.toLowerCase().includes("cancel"));

            // Status breakdown (all bookings)
            bookings.forEach(b => {
                const status = b.status.toLowerCase();
                statusCount[status] = (statusCount[status] || 0) + 1;
            });

            // Financial charts (valid bookings)
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

            // Demand charts (all bookings)
            bookings.forEach(b => {
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
                backgroundColor: airbnbColors.pastel[5],
                borderRadius: 15,
                borderSkipped: false,
                hoverBackgroundColor: "#ff5a75",
            }],
        });

        setPieData({
            labels: Object.keys(nightsCount).map(n => `${n} Night${n > 1 ? "s" : ""}`),
            datasets: [{
                data: Object.values(nightsCount),
                backgroundColor: airbnbColors.pastel,
                borderWidth: 2,
                borderColor: "#fff",
                hoverOffset: 10,
            }],
        });

        setLineData({
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
                label: "Bookings",
                data: bookingsByMonth,
                borderColor: airbnbColors.pastel[3],
                backgroundColor: airbnbColors.pastel[3] + "33",
                fill: true,
                tension: 0.4,
            }],
        });

        setDoughnutData({
            labels: Object.keys(statusCount),
            datasets: [{
                data: Object.values(statusCount),
                backgroundColor: airbnbColors.pastel,
                borderWidth: 2,
                borderColor: "#fff",
                hoverOffset: 10,
            }],
        });

        setRevenuePerHomeData({
            labels: Object.keys(revenuePerHome),
            datasets: [{
                label: "Revenue per Home",
                data: Object.values(revenuePerHome),
                backgroundColor: airbnbColors.pastel[3],
                borderRadius: 15,
                borderSkipped: false,
            }],
        });

        setBookingWeekdayData({
            labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            datasets: [{
                label: "Bookings by Weekday",
                data: bookingsByWeekday,
                backgroundColor: airbnbColors.pastel[5],
                borderRadius: 15,
                borderSkipped: false,
            }],
        });
    }, [bookings, yearFilter, monthFilter]);

    const months = ["All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const chartExplanations = {
        bar: ["💡 Income per month", "❌ Excludes canceled orders"],
        pie: ["💡 Length of stays (nights)", "❌ Excludes canceled orders"],
        line: ["💡 Number of bookings per month", "Includes all bookings (canceled + active)"],
        doughnut: ["💡 Distribution of booking statuses", "Includes canceled bookings"],
        revenue: ["💡 Revenue distribution per home", "❌ Excludes canceled orders"],
        weekday: ["💡 Bookings by check-in weekday", "❌ Excludes canceled bookings"],
    };

    const ChartCard = ({ title, chart, explanation }) => (
        <div className="chart-card">
            <h3>{title}</h3>
            {chart}
            <div className="chart-tooltip">
                {explanation.map((line, i) => <div key={i}>{line}</div>)}
            </div>
        </div>
    );

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

            <div className="charts-container">
                <ChartCard title="Monthly Income" chart={<Bar data={barData} options={baseChartOptions} />} explanation={chartExplanations.bar} />
                <ChartCard title="Orders by Nights" chart={<Pie data={pieData} options={baseChartOptions} />} explanation={chartExplanations.pie} />
                <ChartCard title="Bookings Over Time" chart={<Line data={lineData} options={baseChartOptions} />} explanation={chartExplanations.line} />
                <ChartCard title="Booking Status Breakdown" chart={<Doughnut data={doughnutData} options={baseChartOptions} />} explanation={chartExplanations.doughnut} />
                <ChartCard title="Revenue per Home" chart={<Bar data={revenuePerHomeData} options={baseChartOptions} />} explanation={chartExplanations.revenue} />
                <ChartCard title="Booking Frequency by Weekday" chart={<Bar data={bookingWeekdayData} options={baseChartOptions} />} explanation={chartExplanations.weekday} />
            </div>
        </div>
    );
}
