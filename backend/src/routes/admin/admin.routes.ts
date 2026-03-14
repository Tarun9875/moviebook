// backend/src/routes/admin/admin.routes.ts

import { Router } from "express";
import { protect } from "../../middlewares/auth/auth.middleware";
import { roleMiddleware } from "../../middlewares/role/role.middleware";

import {
  adminDashboard,
  createMovie,
  getAdminMovies,
  deleteMovie,
  getAllUsers
} from "../../controllers/admin/admin.controller";

import {
  getAdminReports
} from "../../controllers/admin/reports.controller";

import {
  getSettings,
  updateSettings
} from "../../controllers/admin/settings.controller";

const router = Router();

/* =====================================================
   🔒 PROTECTED ADMIN ROUTES
===================================================== */

router.use(protect);
router.use(roleMiddleware(["ADMIN"]));

/* =====================================================
   📊 DASHBOARD
===================================================== */

router.get("/dashboard", adminDashboard);

/* =====================================================
   🎬 MOVIE MANAGEMENT
===================================================== */

router.post("/movies", createMovie);
router.get("/movies", getAdminMovies);
router.delete("/movies/:id", deleteMovie);

/* =====================================================
   👥 USER MANAGEMENT
===================================================== */

router.get("/users", getAllUsers);

/* =====================================================
   ⚙️ SETTINGS
===================================================== */

router.get("/settings", getSettings);
router.put("/settings", updateSettings);

/* =====================================================
   📈 REPORTS
===================================================== */

router.get("/reports", getAdminReports);

export default router;