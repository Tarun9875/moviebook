// frontend/src/pages/customer/Ticket.tsx

import { useLocation, useNavigate } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import { QRCodeCanvas } from "qrcode.react";
import { ArrowLeft } from "lucide-react";

export default function Ticket() {

  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state;

  if (!booking) return null;

  const ticketId = `RC-${booking._id.slice(-6).toUpperCase()}`;

  const handleDownload = () => {
    const element = document.getElementById("ticket");
    if (!element) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Movie Ticket</title>
          <style>
            body{
              font-family: Arial;
              padding:20px;
              display:flex;
              justify-content:center;
              background:#f3f3f3;
            }
            .ticket{
              width:420px;
              background:white;
              border:4px dashed #dc2626;
              border-radius:12px;
              padding:20px;
              box-shadow:0 5px 20px rgba(0,0,0,0.2);
            }
            h1{
              text-align:center;
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            ${element.innerHTML}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  return (
    <PageContainer>

      <div className="max-w-3xl mx-auto py-10">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* ================= TICKET ================= */}

        <div
          id="ticket"
          className="bg-white text-black rounded-xl shadow-xl p-8 border-4 border-dashed border-red-600 relative"
        >

          {/* HEADER */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-wide">
              🎬 RUCHU CINEMAS
            </h1>

            <p className="text-sm opacity-70">
              Experience Movies Like Never Before
            </p>
          </div>

          {/* MOVIE TITLE */}
          <h2 className="text-xl font-semibold mb-4 text-center">
            {booking.movieTitle}
          </h2>

          {/* DETAILS */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-6">

            <p><strong>Date:</strong> {booking.selectedDate}</p>
            <p><strong>Time:</strong> {booking.selectedTime}</p>

            <p><strong>Language:</strong> {booking.selectedLanguage}</p>
            <p><strong>Seats:</strong> {booking.seats.join(", ")}</p>

            <p><strong>Payment:</strong> {booking.paymentMethod}</p>
            <p><strong>Total:</strong> ₹{booking.totalAmount}</p>

            <p><strong>Status:</strong> {booking.status}</p>
            <p>
              <strong>Booked On:</strong>{" "}
              {new Date(booking.createdAt).toLocaleString()}
            </p>

          </div>

          {/* QR CODE */}
          <div className="flex justify-between items-center border-t pt-6">

            <div>
              <p className="text-xs opacity-70 mb-2">
                Ticket ID
              </p>

              <p className="font-bold text-lg">
                {ticketId}
              </p>
            </div>

            <QRCodeCanvas
              value={booking._id}
              size={100}
              level="H"
            />

          </div>

          {/* FOOTER */}
          <div className="text-center text-xs opacity-70 mt-6 border-t pt-4">
            Please arrive 20 minutes before showtime.
            <br />
            This ticket is non-transferable.
          </div>

        </div>

        {/* ACTION BUTTONS */}

        <div className="flex justify-center gap-4 mt-8">

          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Print Ticket
          </button>

          <button
            onClick={handleDownload}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Download Ticket
          </button>

        </div>

      </div>

      {/* PRINT STYLE */}

      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }

            #ticket, #ticket * {
              visibility: visible;
            }

            #ticket {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}
      </style>

    </PageContainer>
  );
}