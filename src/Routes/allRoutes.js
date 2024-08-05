import React from 'react';
import { Navigate } from 'react-router-dom';

//Dashboard

//login
import ForgetPasswordPage from '../pages/Authentication/ForgetPassword';
import Login from '../pages/Authentication/Login';
import Logout from '../pages/Authentication/Logout';
import Register from '../pages/Authentication/Register';

// User Profile
import { DASHBOARD_USER_ROLES } from '../common/constants';
import UserProfile from '../pages/Authentication/UserProfile';
import DashboardAssets from '../pages/DashboardAssets/DashboardAssets';
import DashboardBlockchainContracts from '../pages/DashboardBlockchainContracts/DashboardBlockchainContracts';
import DashboardHome from '../pages/DashboardHome/DashboardHome';
import DashboardInfo from '../pages/DashboardInfo/DashboardInfo';
import DashboardNFT from '../pages/DashboardNFT/DashboardNFT';
import NFTsPage from '../pages/DashboardNFT/NFTsPage';
import DashboardTokens from '../pages/DashboardTokens/DashboardTokens';
import DashboardTransactions from '../pages/DashboardTransactions/DashboardTransactions';
import DashboardUserAddresses from '../pages/DashboardUserAddresses/DashboardUserAddresses';
import AuthProtectedRoutes from './AuthProtectedRoutes';
import ResetPaswword from '../pages/Authentication/ResetPassword';
import DashboardUserWallets from '../pages/DashboardAccountsWallets/DashboardUserWallets';
import DashboardAccountantUsers from '../pages/DashboardAccountsWallets/DashboardAccountantUsers';
import DashboardClientProfile from '../pages/DashboardAccountsWallets/DashboardClientProfile';
import DashboardConnectWallets from '../pages/ConnectWallets/DashboardConnectWallets';
import DashboardInvite from '../pages/DashboardInvite /DashboardInvite';

// Auth protected routes
const adminRoutes = [
  {
    path: '/blockchain-contracts',
    component: (
      <AuthProtectedRoutes allowedRoles={[DASHBOARD_USER_ROLES.ADMIN]}>
        <DashboardBlockchainContracts />
      </AuthProtectedRoutes>
    ),
  },
  {
    path: '/user-addresses',
    component: (
      <AuthProtectedRoutes allowedRoles={[DASHBOARD_USER_ROLES.ADMIN]}>
        <DashboardUserAddresses />,
      </AuthProtectedRoutes>
    ),
  },
];

// Public routes
const publicRoutes = [
  { path: '/logout', component: <Logout /> },
  { path: '/login', component: <Login /> },

  { path: '/reset-password', component: <ResetPaswword /> },
  { path: '/invite', component: <DashboardInvite /> },
  { path: '/forgot-password', component: <ForgetPasswordPage /> },
  { path: '/register', component: <Register /> },
  { path: '/address/:address', component: <DashboardInfo /> },

  { path: '/tokens/:token', component: <DashboardTokens /> },
  { path: '/contract/:contractAddress', component: <DashboardNFT /> },

  { path: '/address/:address/assets', component: <DashboardAssets /> },
  { path: '/address/:address/assets', component: <DashboardAssets /> },
  { path: '/address/:address/nfts', component: <NFTsPage /> },
  { path: '/address/:address/history', component: <DashboardTransactions /> },
  // PORTFOLIO
  { path: '/portfolio', component: <DashboardInfo /> },
  { path: '/portfolio/assets', component: <DashboardAssets /> },
  { path: '/portfolio/nfts', component: <NFTsPage /> },
  { path: '/portfolio/history', component: <DashboardTransactions /> },
];

// Home page
const noVerticalLayoutRoutes = [
  { path: '/', component: <DashboardHome /> },
  { path: '/invite', component: <DashboardInvite /> },
];

const authProtectedRoutes = [
  {
    path: '/profile',

    component: (
      <AuthProtectedRoutes
        allowedRoles={[
          DASHBOARD_USER_ROLES.ADMIN,
          DASHBOARD_USER_ROLES.USER,
          DASHBOARD_USER_ROLES.ACCOUNTANT,
        ]}
      >
        <UserProfile />
      </AuthProtectedRoutes>
    ),
  },
  {
    path: '/clients',
    component: (
      <AuthProtectedRoutes
        allowedRoles={[
          DASHBOARD_USER_ROLES.ADMIN,
          DASHBOARD_USER_ROLES.ACCOUNTANT,
        ]}
      >
        <DashboardAccountantUsers />
      </AuthProtectedRoutes>
    ),
  },
  {
    path: '/wallets',
    component: (
      <AuthProtectedRoutes
        allowedRoles={[
          DASHBOARD_USER_ROLES.USER,
          DASHBOARD_USER_ROLES.ACCOUNTANT,
        ]}
      >
        <DashboardUserWallets />
      </AuthProtectedRoutes>
    ),
  },

  {
    path: '/wallets/connect',
    component: (
      // <AuthProtectedRoutes allowedRoles={[DASHBOARD_USER_ROLES.USER]}>
      <DashboardConnectWallets />
      // </AuthProtectedRoutes>
    ),
  },
  {
    path: '/clients/:clientId',
    component: (
      <AuthProtectedRoutes
        allowedRoles={[
          DASHBOARD_USER_ROLES.ADMIN,
          DASHBOARD_USER_ROLES.ACCOUNTANT,
        ]}
      >
        <DashboardClientProfile />
      </AuthProtectedRoutes>
    ),
  },
];

// Combine all routes
const allRoutes = [
  ...publicRoutes,
  ...adminRoutes,
  ...authProtectedRoutes,
  // ...homePage,

  // this route should be at the end of all other routes
  { path: '*', component: <Navigate to="/" /> },
];

export { allRoutes, authProtectedRoutes, noVerticalLayoutRoutes, publicRoutes };
