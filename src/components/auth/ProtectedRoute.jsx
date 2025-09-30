import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const userToken = localStorage.getItem('userToken');
  const userRole = localStorage.getItem('userRole');
  const userEmail = localStorage.getItem('userEmail');

  // Check if user is authenticated
  if (!userToken || !userEmail) {
    console.log('❌ No user token or email found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    console.log('❌ User role not allowed:', userRole, 'Required:', allowedRoles);
    return <Navigate to="/login" replace />;
  }

  console.log('✅ Protected route access granted for role:', userRole);
  return children;
};

export default ProtectedRoute;
