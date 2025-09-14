import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // Check if user is authenticated by looking for the token
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // If authenticated, render the protected component
  return children;
}

export default ProtectedRoute;