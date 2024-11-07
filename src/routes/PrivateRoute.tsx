import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to={"/login"} />;
}

export default PrivateRoute;
