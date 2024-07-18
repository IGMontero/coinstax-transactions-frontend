import React from 'react';
import { useSelector } from 'react-redux';

const RoleBaseRoutes = ({ allowedRoles, children }) => {
  const user = useSelector((state) => state.auth.user);

  const role = user?.role;

  if (!allowedRoles.includes(role)) {
    window.history.back();
    return null;
  }

  return <>{children}</>;
};

export default RoleBaseRoutes;
