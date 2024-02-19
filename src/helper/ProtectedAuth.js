import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export function ProtectedAuth() {
  const { token } = useSelector((state) => state.auth);
  return !token ? <Outlet /> : <Navigate to={"/dashboard"} replace />;
}