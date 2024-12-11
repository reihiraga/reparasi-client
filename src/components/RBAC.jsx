import useAuth from "@/hooks/useAuth";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const RBAC = ({ allowedRoles }) => {
  const location = useLocation();
  const { roles } = useAuth();

  const app = roles.some((role) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );

  return app;
};

export default RBAC;
