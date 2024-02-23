import React from 'react';
import { Navigate } from 'react-router-dom';

//Dashboard
import DashboardEcommerce from '../pages/DashboardEcommerce';

//login
import ForgetPasswordPage from '../pages/Authentication/ForgetPassword';
import Login from '../pages/Authentication/Login';
import Logout from '../pages/Authentication/Logout';
import Register from '../pages/Authentication/Register';

// User Profile
import UserProfile from '../pages/Authentication/user-profile';
import DashboardInfo from '../pages/DashboardInfo/DashboardInfo';
import DashboardNFT from '../pages/DashboardNFT/DashboardNFT';

const authProtectedRoutes = [
  { path: '/dashboard', component: <DashboardInfo /> },
  { path: '/address/:address/:type', component: <DashboardInfo /> },
  { path: '/index', component: <DashboardEcommerce /> },

  //User Profile
  { path: '/profile', component: <UserProfile /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: '/',
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: '*', component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  // Authentication Page
  { path: '/logout', component: <Logout /> },
  { path: '/login', component: <Login /> },
  { path: '/forgot-password', component: <ForgetPasswordPage /> },
  { path: '/register', component: <Register /> },
];

const allRoutes = [
  { path: '/logout', component: <Logout /> },
  { path: '/login', component: <Login /> },
  { path: '/forgot-password', component: <ForgetPasswordPage /> },
  { path: '/register', component: <Register /> },
  { path: '/dashboard', component: <DashboardInfo /> },
  { path: '/nfts/ethereum/:nftId', component: <DashboardNFT /> },
  { path: '/address/:address/:type', component: <DashboardInfo /> },
  { path: '/index', component: <DashboardEcommerce /> },

  //User Profile
  { path: '/profile', component: <UserProfile /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: '/',
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: '*', component: <Navigate to="/dashboard" /> },
];

export { allRoutes, authProtectedRoutes, publicRoutes };
