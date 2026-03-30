//from backend/src/config/cors.ts
import cors from "cors";

const corsOptions = {
  origin:  "http://localhost:5173",
    "https://moviebook-2-4x5l.onrender.com", // 👈 frontend URL
  credentials: true,               // 👈 allow cookies / auth headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

export default corsOptions;
