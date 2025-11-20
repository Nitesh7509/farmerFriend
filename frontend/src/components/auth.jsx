import { AuthContext } from "../contexts/authcontext";
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

const Auth = ({ children, requiredRole }) => {
  const { token, role, loading } = useContext(AuthContext);
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If we have a required role and the user doesn't have it, show unauthorized
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default Auth;