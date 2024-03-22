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
import DashboardBlockchainContracts from '../pages/DashboardBlockchainContracts/DashboardBlockchainContracts';
import DashboardUserAddresses from '../pages/DashboardUserAddresses/DashboardUserAddresses';
import DashboardAssets from '../pages/DashboardAssets/DashboardAssets';
import DashboardTransactions from '../pages/DashboardTransactions/DashboardTransactions';
import NFTsPage from '../pages/DashboardNFT/NFTsPage';

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
  { path: '/contract/:contractAddress', component: <DashboardNFT /> },
  { path: '/address/:address/tokens', component: <DashboardInfo /> },
  { path: '/address/:address/assets', component: <DashboardAssets /> },
  { path: '/address/:address/nfts', component: <NFTsPage /> },
  { path: '/address/:address/history', component: <DashboardTransactions /> },
  {
    path: '/blockchain-contracts',
    component: <DashboardBlockchainContracts />,
  },
  {
    path: '/user-addresses',
    component: <DashboardUserAddresses />,
  },

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
