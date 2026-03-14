// backend/src/routes/index.ts

import { Router } from "express";

import authRoutes from "./auth/auth.route";
import bookingRoutes from "./booking/booking.route";
import movieRoutes from "./movie/movie.routes";
import adminRoutes from "./admin/admin.routes";
import showRoutes from "./show/show.routes";
import showSeatsRoutes from "./seats/showSeats.routes";
import userRoutes from "./user/user.route";
import reportsRoutes from "./admin/reports.route";
import settingsRoutes from "./admin/settings.route";

const router = Router();

/* AUTH */
router.use("/auth", authRoutes);

/* BOOKINGS */
router.use("/bookings", bookingRoutes);

/* MOVIES */
router.use("/movies", movieRoutes);

/* PUBLIC SETTINGS (MUST COME BEFORE ADMIN) */
router.use("/admin", settingsRoutes);

/* ADMIN ROUTES */
router.use("/admin", adminRoutes);
router.use("/admin", reportsRoutes);

/* SHOWS */
router.use("/shows", showRoutes);
router.use("/shows", showSeatsRoutes);

/* USERS */
router.use("/users", userRoutes);

export default router;