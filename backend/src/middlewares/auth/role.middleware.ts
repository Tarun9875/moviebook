// backend/src/middlewares/auth/role.middleware.ts
import { RequestHandler } from "express";

/* =====================================================
   ADMIN ROLE MIDDLEWARE
===================================================== */

export const isAdmin: RequestHandler = (req: any, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  // normalize role
  const userRole = req.user.role?.toUpperCase();

  if (userRole !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};