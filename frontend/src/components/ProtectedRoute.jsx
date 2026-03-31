import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRole, adminOnly }) {
  const token = localStorage.getItem('access');
  const role = localStorage.getItem('role');
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to={role === 'donor' ? '/donor-dashboard' : '/hospital-dashboard'} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === 'donor' ? '/donor-dashboard' : '/hospital-dashboard'} replace />;
  }

  return children;
}
