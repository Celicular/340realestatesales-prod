// Authentication utility functions
import { logoutUser } from '../firebase/auth';

export const logout = async () => {
  try {
    // Logout from Firebase Auth
    await logoutUser();
    console.log('✅ Firebase Auth logout successful');
  } catch (error) {
    console.error('❌ Firebase Auth logout error:', error);
  }
  
  // Clear all session data
  localStorage.removeItem('userToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  
  // Redirect to login page
  window.location.hash = '/login';
};

export const getCurrentUser = () => {
  const userEmail = localStorage.getItem('userEmail');
  const userToken = localStorage.getItem('userToken');
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');
  
  if (!userEmail || !userToken) return null;
  
  return {
    email: userEmail,
    uid: userId,
    name: userName,
    role: userRole,
    displayName: userName
  };
};

export const isAuthenticated = () => {
  const userToken = localStorage.getItem('userToken');
  const userEmail = localStorage.getItem('userEmail');
  
  return !!(userToken && userEmail);
};

export const hasRole = (requiredRole) => {
  const userRole = localStorage.getItem('userRole');
  return userRole === requiredRole;
};

export const hasAnyRole = (requiredRoles) => {
  const userRole = localStorage.getItem('userRole');
  return requiredRoles.includes(userRole);
};
