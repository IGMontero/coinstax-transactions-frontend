import React from 'react';
import { useSelector } from 'react-redux';
import { isDevelopment } from '../config';

const AuthProtectedRoutes = ({ allowedRoles, children }) => {
  const user = useSelector((state) => state.auth.user);

  const role = user?.role;

  if (!allowedRoles.includes(role)) {
    if (isDevelopment) {
      alert('Development Message: You are not authorized to access this page');
    }

    window.history.back();
    return null;
  }

  return <>{children}</>;
};

export default AuthProtectedRoutes;
