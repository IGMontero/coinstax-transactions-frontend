import React from 'react';
import { Navigate } from 'react-router-dom';

//Dashboard

//login
import ForgetPasswordPage from '../pages/Authentication/ForgetPassword';
import Login from '../pages/Authentication/Login';
import Logout from '../pages/Authentication/Logout';
import Register from '../pages/Authentication/Register';

// User Profile
import { DASHBOARD_USER_ROLES } from '../Components/constants/constants';
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
import RoleBaseRoutes from './RoleBaseRoutes';
import ResetPaswword from '../pages/Authentication/ResetPassword';

// Auth protected routes
const adminRoutes = [
  {
    path: '/blockchain-contracts',
    component: (
      <RoleBaseRoutes allowedRoles={[DASHBOARD_USER_ROLES.ADMIN]}>
        <DashboardBlockchainContracts />,
      </RoleBaseRoutes>
    ),
  },
  {
    path: '/user-addresses',
    component: (
      <RoleBaseRoutes allowedRoles={[DASHBOARD_USER_ROLES.ADMIN]}>
        <DashboardUserAddresses />,
      </RoleBaseRoutes>
    ),
  },
];

// Public routes
const publicRoutes = [
  { path: '/logout', component: <Logout /> },
  { path: '/login', component: <Login /> },
  { path: '/reset-password', component: <ResetPaswword /> },
  { path: '/forgot-password', component: <ForgetPasswordPage /> },
  { path: '/register', component: <Register /> },
  { path: '/address/:address', component: <DashboardInfo /> },
  { path: '/tokens/:token', component: <DashboardTokens /> },
  { path: '/contract/:contractAddress', component: <DashboardNFT /> },
  { path: '/address/:address/assets', component: <DashboardAssets /> },
  { path: '/address/:address/nfts', component: <NFTsPage /> },
  { path: '/address/:address/history', component: <DashboardTransactions /> },
];

// Home page
const homePage = [{ path: '/', component: <DashboardHome /> }];

const authProtectedRoutes = [
  {
    path: '/profile',

    // TODO: Cambiar guard a AuthProtectedRoutes
    component: (
      <RoleBaseRoutes
        allowedRoles={[
          DASHBOARD_USER_ROLES.ADMIN,
          DASHBOARD_USER_ROLES.USER,
          DASHBOARD_USER_ROLES.ACCOUNTANT,
        ]}
      >
        <UserProfile />
      </RoleBaseRoutes>
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

export { allRoutes, authProtectedRoutes, homePage, publicRoutes };
