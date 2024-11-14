import { useEffect, useState } from "react";
import api from "../utils/api";
import { Bar } from "react-chartjs-2";
import toast from "react-hot-toast";

function PhotosDashboard() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await api.get("/dashboard/statistics");
        setStatistics(response.data);
      } catch (error) {
        toast.error("Failed to fetch photo statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) return <div>Loading...</div>;

  const data = {
    labels: statistics.photosByUser.map((user) => user.userName), // Use userName instead of userId
    datasets: [
      {
        label: "Photos Uploaded",
        data: statistics.photosByUser.map((user) => user.count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Photos Dashboard</h2>
      <p>Total Photos: {statistics.totalPhotos}</p>
      <Bar data={data} options={{ responsive: true }} />
    </div>
  );
}

export default PhotosDashboard;
