import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access");

  // Redirect to login if no valid JWT access token exists
  if (!token || token === "null" || token === "undefined") {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
