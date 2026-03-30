import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/axios";

interface SeatCategory {
  type: string;
  price: number;
  rows: string[];
  seatsPerRow: number;
}

interface ShowData {
  movieTitle: string;
  date: string;
  time: string;
  screen: number;
  seatCategories: SeatCategory[];
}

interface SeatState {
  booked: string[];
  blocked: string[];
}

export default function ShowSeats() {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState<ShowData | null>(null);
  const [seatState, setSeatState] = useState<SeatState>({
    booked: [],
    blocked: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const showRes = await api.get(`/shows/${showId}`);
        setShow(showRes.data.show);

        const seatRes = await api.get(`/shows/${showId}/seats`);
        setSeatState(seatRes.data);
      } catch {
        toast.error("Failed to load seat data ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showId]);

  /* ================= TOGGLE BLOCK ================= */
  const toggleBlock = (seat: string) => {
    if (seatState.booked.includes(seat)) {
      toast.warning("Cannot block booked seat 🔴");
      return;
    }

    setSeatState((prev) => ({
      ...prev,
      blocked: prev.blocked.includes(seat)
        ? prev.blocked.filter((s) => s !== seat)
        : [...prev.blocked, seat],
    }));
  };

  /* ================= SAVE ================= */
  const saveChanges = async () => {
    try {
      setSaving(true);

      await api.put(`/shows/${showId}/seats`, {
        blocked: seatState.blocked,
      });

      toast.success("Seat layout updated successfully 🎉");
    } catch {
      toast.error("Failed to update seats ❌");
    } finally {
      setSaving(false);
    }
  };

  /* ================= RESET ================= */
  const resetBlocked = () => {
    setSeatState((prev) => ({
      ...prev,
      blocked: [],
    }));

    toast.info("Blocked seats reset");
  };

  if (loading || !show) {
    return <p style={{ color: "var(--text-color)" }}>Loading seats...</p>;
  }

  return (
    <div
      className="max-w-7xl mx-auto px-4 py-6"
      style={{ color: "var(--text-color)" }}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <button
            onClick={() => navigate("/admin/shows")}
            className="mb-2 text-sm opacity-70"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-bold">🎟 Manage Seats</h1>

          <p className="text-sm opacity-70">
            {show.movieTitle} | {show.date} | {show.time} | Screen {show.screen}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={resetBlocked}
            className="px-4 py-2 bg-gray-600 text-white rounded"
          >
            Reset
          </button>

          <button
            onClick={saveChanges}
            disabled={saving}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* LEGEND */}
      <div className="flex gap-6 mb-6 text-sm">
        <div className="flex gap-2 items-center">
          <div className="w-4 h-4 bg-red-600 rounded" /> Booked
        </div>

        <div className="flex gap-2 items-center">
          <div className="w-4 h-4 bg-yellow-500 rounded" /> Blocked
        </div>

        <div className="flex gap-2 items-center">
          <div className="w-4 h-4 border rounded" /> Available
        </div>
      </div>

      {/* SEATS */}
      <div className="p-6 rounded-xl border">
        {show.seatCategories.map((category) => (
          <div key={category.type} className="mb-8">
            <h2 className="font-semibold mb-3">
              {category.type} (₹{category.price})
            </h2>

            {category.rows.map((row) => (
              <div key={row} className="flex justify-center gap-2 mb-2">
                <div className="w-6 font-bold">{row}</div>

                {Array.from({ length: category.seatsPerRow }).map((_, i) => {
                  const seatId = `${row}${i + 1}`;
                  const isBooked = seatState.booked.includes(seatId);
                  const isBlocked = seatState.blocked.includes(seatId);

                  return (
                    <button
                      key={seatId}
                      onClick={() => toggleBlock(seatId)}
                      className="w-8 h-8 rounded text-xs"
                      style={{
                        backgroundColor: isBooked
                          ? "#dc2626"
                          : isBlocked
                          ? "#f59e0b"
                          : "white",
                        color: isBooked || isBlocked ? "#fff" : "#000",
                        cursor: isBooked ? "not-allowed" : "pointer",
                      }}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}