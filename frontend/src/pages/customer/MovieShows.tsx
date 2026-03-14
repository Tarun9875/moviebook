//frontend/src/pages/customer/MovieShows.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import api from "../../services/axios";
import { toast } from "react-toastify";

interface Show {
  _id: string;
  date: string;
  time: string;
  language: string;
  screen: number;
  status: string;
}

export default function MovieShows() {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const res = await api.get(`/shows?movie=${movieId}`);
        setShows(res.data.shows.filter((s: Show) => s.status === "ACTIVE"));
      } catch {
        toast.error("Failed to load shows ❌");
      } finally {
        setLoading(false);
      }
    };

    if (movieId) fetchShows();
  }, [movieId]);

  if (loading) {
    return (
      <PageContainer>
        <div className="py-40 text-center">Loading shows...</div>
      </PageContainer>
    );
  }

  if (shows.length === 0) {
    return (
      <PageContainer>
        <div className="py-40 text-center">No shows available</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto py-12 px-6">
         {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-sm font-medium hover:text-red-500 transition"
          style={{ color: "var(--text-color)" }}
        >
          <span className="text-xl">←</span>
          Back
        </button>

        <h1 className="text-3xl font-bold mb-8">
          Select Show
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {shows.map((show) => (
            <div
              key={show._id}
              className="p-6 rounded-xl shadow-md border cursor-pointer hover:shadow-lg transition"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
              onClick={() =>
                navigate(`/shows/${show._id}/seats`)
              }
            >
              <p><strong>📅 Date:</strong> {show.date.slice(0,10)}</p>
              <p><strong>⏰ Time:</strong> {show.time}</p>
              <p><strong>🎥 Language:</strong> {show.language}</p>
              <p><strong>🏢 Screen:</strong> {show.screen}</p>
            </div>
          ))}
        </div>

      </div>
    </PageContainer>
  );
}