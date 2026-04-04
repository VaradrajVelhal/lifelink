import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // Since we use sessions, the browser handles the cookie. 
  // We can use a simple localStorage flag for client-side routing.
  const username = localStorage.getItem('username');

  if (!username) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
