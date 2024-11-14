import { useEffect, useState } from "react";
import api from "../utils/api";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import PhotosDashboard from "../components/PhotosDashboard";

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/dashboard");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading...</div>;

  const barData = {
    labels: ["Users", "Events"],
    datasets: [
      {
        label: "Count",
        data: [dashboardData.userCount, dashboardData.eventCount],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  };

  const lineData = {
    labels: dashboardData.latestEvents.map((event) =>
      new Date(event.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Events Over Time",
        data: dashboardData.latestEvents.map(
          (event) => event.participants.length
        ),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  // Prepare chat statistics data for chart
  const messageStatsData = {
    labels: dashboardData.messageStats.map(
      (stat) => `${stat.userName} - ${stat.eventName} - ${stat.date}`
    ),
    datasets: [
      {
        label: "Messages Sent",
        data: dashboardData.messageStats.map((stat) => stat.count),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">User and Event Count</h2>
        <Bar
          data={barData}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
          }}
        />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Events Over Time</h2>
        <Line
          data={lineData}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
          }}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Message Statistics</h2>
        <Bar
          data={messageStatsData}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
          }}
        />
      </div>
      <div className="bg-white  p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Photo Statistics</h2>
        <PhotosDashboard />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2">
        <h2 className="text-xl font-bold mb-4">Latest Events</h2>
        <ul>
          {dashboardData.latestEvents.map((event) => (
            <li key={event._id} className="border-b py-2">
              <strong>{event.title}</strong> -{" "}
              {new Date(event.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
