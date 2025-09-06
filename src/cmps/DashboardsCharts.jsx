import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export function DashboardsCharts({ bookings }) {
    const [barData, setBarData] = useState({
        labels: [],
        datasets: [{ label: "Income", data: [], backgroundColor: "#27ae60" }]
    });

    const [pieData, setPieData] = useState({
        labels: [],
        datasets: [{ data: [], backgroundColor: ["#2e86de", "#f39c12", "#27ae60", "#c0392b", "#d35400"] }]
    });

    const currentYear = new Date().getFullYear();
    const [monthFilter, setMonthFilter] = useState(0);
    const [yearFilter, setYearFilter] = useState(currentYear);

    useEffect(() => {
        // Bar chart: monthly income
        const monthlyIncome = Array(12).fill(0);
        const nightsCount = {}; // for pie chart

        if (bookings && bookings.length > 0) {
            bookings.forEach((b) => {
                const checkIn = new Date(b.checkIn);
                const nights = Math.ceil((new Date(b.checkOut) - checkIn) / (1000 * 60 * 60 * 24));

                // Filter by year AND month
                const matchesYear = checkIn.getFullYear() === Number(yearFilter);
                const matchesMonth = monthFilter === 0 || checkIn.getMonth() + 1 === monthFilter;

                if (matchesYear && matchesMonth) {
                    monthlyIncome[checkIn.getMonth()] += b.totalPrice;
                    nightsCount[nights] = (nightsCount[nights] || 0) + 1;
                }
            });
        }

        setBarData({
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{ label: `Income ${yearFilter}${monthFilter ? " - Month " + monthFilter : ""}`, data: monthlyIncome, backgroundColor: "#27ae60" }]
        });

        setPieData({
            labels: Object.keys(nightsCount).map(n => `${n} Night${n > 1 ? "s" : ""}`),
            datasets: [{ data: Object.values(nightsCount), backgroundColor: ["#2e86de", "#f39c12", "#27ae60", "#c0392b", "#d35400"] }]
        });
    }, [bookings, yearFilter, monthFilter]);

    return (
        <div className="dashboard-charts">
            <div className="charts-filters">
                <label>Filter by Year: </label>
                <input
                    type="number"
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    style={{ width: "100px", marginLeft: "0.5rem" }}
                />
                <label>Filter by Month: </label>
                <label>Filter by Month: </label>
                <select
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(Number(e.target.value))}
                    style={{ marginLeft: "0.5rem" }}
                >
                    <option value={0}>All Months</option>
                    <option value={1}>January</option>
                    <option value={2}>February</option>
                    <option value={3}>March</option>
                    <option value={4}>April</option>
                    <option value={5}>May</option>
                    <option value={6}>June</option>
                    <option value={7}>July</option>
                    <option value={8}>August</option>
                    <option value={9}>September</option>
                    <option value={10}>October</option>
                    <option value={11}>November</option>
                    <option value={12}>December</option>
                </select>


            </div>

            <div className="charts-container">
                <div className="chart-card">
                    <div className="chart-bar">
                        <h3>Monthly Income</h3>
                        <Bar
                            data={barData}
                            options={{
                                responsive: true,
                                plugins: { legend: { position: "top" }, title: { display: false } },
                                scales: { y: { beginAtZero: true }, x: {} }
                            }}
                        />
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-pie">
                        <h3>Orders by Nights</h3>
                        <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
