import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const PrivateRoute = ({ allowedRoles = [] }) => {
  const { auth } = useAuth();
  const token = localStorage.getItem("token");

  // Cek token valid dan tidak expired
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  // Ambil role dari auth context
  const role = auth?.user?.role?.name;

  // Jika role tidak diizinkan
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Jika lolos semua validasi
  return <Outlet />;
};

export default PrivateRoute;
