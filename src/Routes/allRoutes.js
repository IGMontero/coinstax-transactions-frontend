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
import DashboardHome from '../pages/DashboardHome/DashboardHome';
import DashboardTokens from '../pages/DashboardTokens/DashboardTokens';


// Auth protected routes
const authProtectedRoutes = [
  { path: '/address/:address', component: <DashboardInfo /> },
  { path: '/index', component: <DashboardEcommerce /> },
  { path: '/tokens/:token', component: <DashboardTokens /> },
  { path: '/contract/:contractAddress', component: <DashboardNFT /> },
  { path: '/address/:address/assets', component: <DashboardAssets /> },
  { path: '/address/:address/nfts', component: <NFTsPage /> },
  { path: '/address/:address/history', component: <DashboardTransactions /> },
  { path: '/blockchain-contracts', component: <DashboardBlockchainContracts /> },
  { path: '/user-addresses', component: <DashboardUserAddresses /> },
];

// Public routes
const publicRoutes = [
  { path: '/logout', component: <Logout /> },
  { path: '/login', component: <Login /> },
  { path: '/forgot-password', component: <ForgetPasswordPage /> },
  { path: '/register', component: <Register /> },
];

// Home page
const homePage = [{ path: '/', component: <DashboardHome /> }];

// Combine all routes
const allRoutes = [
  ...authProtectedRoutes,
  ...publicRoutes,
  ...homePage,

  // this route should be at the end of all other routes
  { path: '*', component: <Navigate to="/" /> },
];

export { allRoutes, authProtectedRoutes, publicRoutes, homePage };