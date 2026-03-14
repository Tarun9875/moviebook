// frontend/src/pages/customer/Payment.tsx

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useAppSelector } from "../../app/hooks";
import PageContainer from "../../components/layout/PageContainer";
import api from "../../services/axios";
import { toast } from "react-toastify";

export default function Payment() {

  const { showId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);

  const bookingData = location.state;

  if (!bookingData) {
    navigate("/");
    return null;
  }

  const {
    movieTitle,
    selectedSeats,
    selectedDate,
    selectedTime,
    selectedLanguage,
    totalPrice
  } = bookingData;

  const [paymentMethod, setPaymentMethod] =
    useState<"UPI" | "CARD">("UPI");

  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [processing, setProcessing] = useState(false);

  /* ================= VALIDATION FUNCTIONS ================= */

  const validateUPI = (upi: string) => {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/;
    return upiRegex.test(upi);
  };

  const validateCardNumber = (num: string) => {
    const clean = num.replace(/\s/g, "");
    return /^\d{16}$/.test(clean);
  };

  const validateExpiry = (exp: string) => {
    const expRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return expRegex.test(exp);
  };

  const validateCVV = (cvv: string) => {
    return /^\d{3,4}$/.test(cvv);
  };

  /* ================= FORMAT CARD NUMBER ================= */

  const handleCardChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 16);

    const formatted = cleaned
      .match(/.{1,4}/g)
      ?.join(" ") || "";

    setCardNumber(formatted);
  };

  /* ================= PAYMENT ================= */

  const handlePayment = async () => {

    try {

      /* ===== UPI VALIDATION ===== */

      if (paymentMethod === "UPI") {

        if (!upiId) {
          toast.error("Please enter UPI ID");
          return;
        }

        if (!validateUPI(upiId)) {
          toast.error("Invalid UPI ID");
          return;
        }

      }

      /* ===== CARD VALIDATION ===== */

      if (paymentMethod === "CARD") {

        if (!validateCardNumber(cardNumber)) {
          toast.error("Invalid card number");
          return;
        }

        if (!validateExpiry(expiry)) {
          toast.error("Invalid expiry date (MM/YY)");
          return;
        }

        if (!validateCVV(cvv)) {
          toast.error("Invalid CVV");
          return;
        }

      }

      setProcessing(true);

      const res = await api.post("/bookings", {
        showId,
        seats: selectedSeats,
        paymentMethod,
        name: user?.name,
        email: user?.email,
        movieTitle,
        selectedDate,
        selectedTime,
        selectedLanguage,
        totalAmount: totalPrice
      });

      toast.success("Booking Confirmed 🎉");

      navigate(`/my-bookings/${res.data.booking._id}`);

    } catch (error: any) {

      toast.error(
        error.response?.data?.message ||
        "Payment failed ❌"
      );

    } finally {

      setProcessing(false);

    }

  };

  return (

    <PageContainer>

      <div className="max-w-6xl mx-auto p-8">

        {/* BACK BUTTON */}

        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-red-600 font-semibold hover:underline"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ================= BOOKING SUMMARY ================= */}

          <div className="border p-6 rounded-xl shadow">

            <h2 className="text-xl font-semibold mb-4">
              Booking Summary
            </h2>

            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>

            <p><strong>Movie:</strong> {movieTitle}</p>
            <p><strong>Date:</strong> {selectedDate}</p>
            <p><strong>Time:</strong> {selectedTime}</p>
            <p><strong>Language:</strong> {selectedLanguage}</p>
            <p><strong>Seats:</strong> {selectedSeats.join(", ")}</p>

            <p className="mt-3 font-bold text-lg">
              Total: ₹{totalPrice}
            </p>

          </div>

          {/* ================= PAYMENT SECTION ================= */}

          <div className="border p-6 rounded-xl shadow">

            <h2 className="text-xl font-semibold mb-4">
              Payment Method
            </h2>

            {/* METHOD SELECT */}

            <div className="flex gap-4 mb-6">

              <button
                onClick={() => setPaymentMethod("UPI")}
                className={`px-4 py-2 rounded ${
                  paymentMethod === "UPI"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                UPI
              </button>

              <button
                onClick={() => setPaymentMethod("CARD")}
                className={`px-4 py-2 rounded ${
                  paymentMethod === "CARD"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                Debit / Credit Card
              </button>

            </div>

            {/* ================= UPI ================= */}

            {paymentMethod === "UPI" && (

              <input
                type="text"
                placeholder="example@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full p-3 border rounded mb-4"
              />

            )}

            {/* ================= CARD ================= */}

            {paymentMethod === "CARD" && (

              <>

                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={(e) => handleCardChange(e.target.value)}
                  className="w-full p-3 border rounded mb-3"
                />

                <div className="flex gap-3 mb-3">

                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) =>
                      setExpiry(e.target.value)
                    }
                    className="w-1/2 p-3 border rounded"
                  />

                  <input
                    type="password"
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value)
                    }
                    className="w-1/2 p-3 border rounded"
                  />

                </div>

              </>

            )}

            {/* ================= PAY BUTTON ================= */}

            <button
              onClick={handlePayment}
              disabled={processing}
              className="mt-4 w-full py-3 rounded bg-red-600 text-white hover:bg-red-700"
            >
              {processing
                ? "Processing..."
                : "Confirm Booking"}
            </button>

          </div>

        </div>

      </div>

    </PageContainer>

  );

}