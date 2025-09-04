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
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function DashboardsCharts({ bookings }) {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{ label: "Income", data: [], backgroundColor: "#27ae60" }]
    });

    const currentYear = new Date().getFullYear();
    const [yearFilter, setYearFilter] = useState(currentYear);

    useEffect(() => {
        const monthlyIncome = Array(12).fill(0);

        if (bookings && bookings.length > 0) {
            bookings.forEach((b) => {
                const checkIn = new Date(b.checkIn);
                if (checkIn.getFullYear() === Number(yearFilter)) {
                    const monthIndex = checkIn.getMonth(); // 0 = Jan
                    monthlyIncome[monthIndex] += b.totalPrice;
                }
            });
        }

        setChartData({
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [
                { label: `Income ${yearFilter}`, data: monthlyIncome, backgroundColor: "#27ae60" }
            ]
        });
    }, [bookings, yearFilter]);

    return (
        <div>
            <div style={{ marginBottom: "1rem" }}>
                <label>Filter by Year: </label>
                <input
                    type="number"
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    style={{ width: "100px", marginLeft: "0.5rem" }}
                />
            </div>

            {chartData.datasets[0].data.length > 0 && (
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: { legend: { position: "top" }, title: { display: true, text: `Monthly Income ${yearFilter}` } },
                        scales: {
                            y: { beginAtZero: true, title: { display: true, text: "Income ($)" } },
                            x: { title: { display: true, text: "Month" } }
                        }
                    }}
                />
            )}
        </div>
    );
}
