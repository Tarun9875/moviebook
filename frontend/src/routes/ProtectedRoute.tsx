// src/routes/ProtectedRoute.tsx

import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

interface Props {
  children: React.ReactNode;
  role?: string;
}

export default function ProtectedRoute({ children, role }: Props) {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  /* ================= NOT LOGGED IN ================= */
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  /* ================= ROLE CHECK ================= */
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  /* ================= ACCESS GRANTED ================= */
  return <>{children}</>;
}