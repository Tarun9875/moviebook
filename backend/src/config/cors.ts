//from backend/src/config/cors.ts
import cors from "cors";

const corsOptions = {
  origin: "https://moviebook-u80e.onrender.com", // 👈 frontend URL
  credentials: true,               // 👈 allow cookies / auth headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

export default corsOptions;
