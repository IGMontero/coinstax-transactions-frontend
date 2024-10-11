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
import DashboardAccountantUsers from '../pages/DashboardAccountsWallets/Accountants/DashboardAccountantUsers';
import DashboardClientProfile from '../pages/DashboardAccountsWallets/DashboardClientProfile';
import DashboardConnectWallets from '../pages/ConnectWallets/DashboardConnectWallets';
import DashboardInvite from '../pages/DashboardInvite /DashboardInvite';
import Clients from '../pages/DashboardAccountsWallets/Admin/Clients';
import Users from '../pages/DashboardAccountsWallets/Admin/Users';
import UsersProfile from '../pages/DashboardAccountsWallets/Admin/components/Profiles/UsersProfile';
import DashboardAccountantAgents from '../pages/DashboardAccountsWallets/Accountants/DashboardAccountantAgents';
import DashboardClientsAgent from '../pages/DashboardAccountsWallets/Agent/DashboardClientsAgent';
import VerifyEmail from '../pages/Authentication/VerifyEmail';
import ConfirmEmail from '../pages/Authentication/ConfirmEmail';
import DashboardCompleteInfo from '../pages/CompleteInfo/DashboardCompleteInfo';

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
        <DashboardUserAddresses />
      </AuthProtectedRoutes>
    ),
  },
  {
    path: '/admin/clients',
    component: (
      <AuthProtectedRoutes allowedRoles={[DASHBOARD_USER_ROLES.ADMIN]}>
        <Clients />
      </AuthProtectedRoutes>
    ),
  },
  {
    path: '/admin/clients/:clientId',
    component: (
      <AuthProtectedRoutes allowedRoles={[DASHBOARD_USER_ROLES.ADMIN]}>
        <DashboardClientProfile />
      </AuthProtectedRoutes>
    ),
  },
  {
    path: '/admin/users',
    component: (
      <AuthProtectedRoutes allowedRoles={[DASHBOARD_USER_ROLES.ADMIN]}>
        <Users />
      </AuthProtectedRoutes>
    ),
  },
  {
    path: '/admin/users/:userId',
    component: (
      <AuthProtectedRoutes allowedRoles={[DASHBOARD_USER_ROLES.ADMIN]}>
        <UsersProfile />
      </AuthProtectedRoutes>
    ),
  },
  {
    path: '/admin/accountants/:userId',
    component: (
      <AuthProtectedRoutes allowedRoles={[DASHBOARD_USER_ROLES.ADMIN]}>
        <UsersProfile />
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
  { path: '/confirm-email', component: <VerifyEmail /> },
  { path: '/confirm-email-change', component: <ConfirmEmail /> },

  { path: '/tokens/:token', component: <DashboardTokens /> },
  { path: '/contract/:contractAddress', component: <DashboardNFT /> },

  { path: '/address/:address/assets', component: <DashboardAssets /> },
  { path: '/address/:address/nfts', component: <NFTsPage /> },
  { path: '/address/:address/history', component: <DashboardTransactions /> },
  {
    path: '/complete-profile',
    component: <DashboardCompleteInfo />,
  },
  // Default to wallets page
  {
    path: '/wallets',
    component: <DashboardConnectWallets />,
  },
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
      <AuthProtectedRoutes allowedRoles={[DASHBOARD_USER_ROLES.ACCOUNTANT]}>
        <DashboardAccountantUsers />
      </AuthProtectedRoutes>
    ),
  },
  {
    path: '/agent/clients',
    component: (
      <AuthProtectedRoutes allowedRoles={[DASHBOARD_USER_ROLES.AGENT]}>
        <DashboardClientsAgent />
      </AuthProtectedRoutes>
    ),
  },

  // {
  //   path: '/wallets',
  //   component: (
  //     <AuthProtectedRoutes
  //       allowedRoles={[
  //         DASHBOARD_USER_ROLES.ADMIN,
  //         DASHBOARD_USER_ROLES.USER,
  //         DASHBOARD_USER_ROLES.ACCOUNTANT,
  //         DASHBOARD_USER_ROLES.AGENT,
  //       ]}
  //     >
  //       <DashboardUserWallets />
  //     </AuthProtectedRoutes>
  //   ),
  // },

  {
    path: '/wallets',
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
          DASHBOARD_USER_ROLES.AGENT,
        ]}
      >
        <DashboardClientProfile />
      </AuthProtectedRoutes>
    ),
  },
  {
    path: '/agents',
    component: (
      <AuthProtectedRoutes allowedRoles={[DASHBOARD_USER_ROLES.ACCOUNTANT]}>
        <DashboardAccountantAgents />
      </AuthProtectedRoutes>
    ),
  },
  // PORTFOLIO
  {
    path: '/portfolio',
    component: (
      <AuthProtectedRoutes
        allowedRoles={[
          DASHBOARD_USER_ROLES.ADMIN,
          DASHBOARD_USER_ROLES.USER,
          DASHBOARD_USER_ROLES.ACCOUNTANT,
          DASHBOARD_USER_ROLES.AGENT,
        ]}
      >
        <DashboardInfo />
      </AuthProtectedRoutes>
    ),
  },

  {
    path: '/portfolio/assets',
    component: (
      <AuthProtectedRoutes
        allowedRoles={[
          DASHBOARD_USER_ROLES.ADMIN,
          DASHBOARD_USER_ROLES.USER,
          DASHBOARD_USER_ROLES.ACCOUNTANT,
          DASHBOARD_USER_ROLES.AGENT,
        ]}
      >
        {' '}
        <DashboardAssets />
      </AuthProtectedRoutes>
    ),
  },
  {
    path: '/portfolio/nfts',
    component: (
      <AuthProtectedRoutes
        allowedRoles={[
          DASHBOARD_USER_ROLES.ADMIN,
          DASHBOARD_USER_ROLES.USER,
          DASHBOARD_USER_ROLES.ACCOUNTANT,
          DASHBOARD_USER_ROLES.AGENT,
        ]}
      >
        <NFTsPage />
      </AuthProtectedRoutes>
    ),
  },
  {
    path: '/portfolio/history',
    component: (
      <AuthProtectedRoutes
        allowedRoles={[
          DASHBOARD_USER_ROLES.ADMIN,
          DASHBOARD_USER_ROLES.USER,
          DASHBOARD_USER_ROLES.ACCOUNTANT,
          DASHBOARD_USER_ROLES.AGENT,
        ]}
      >
        <DashboardTransactions />
      </AuthProtectedRoutes>
    ),
  },

  // PORTFOLIO USERS
  {
    path: '/users/:userId/portfolio',
    component: (
      <AuthProtectedRoutes
        allowedRoles={[
          DASHBOARD_USER_ROLES.ADMIN,
          DASHBOARD_USER_ROLES.USER,
          DASHBOARD_USER_ROLES.ACCOUNTANT,
          DASHBOARD_USER_ROLES.AGENT,
        ]}
      >
        <DashboardInfo />
      </AuthProtectedRoutes>
    ),
  },
  {
    path: '/users/:userId/portfolio/assets',
    component: (
      <AuthProtectedRoutes
        allowedRoles={[
          DASHBOARD_USER_ROLES.ADMIN,
          DASHBOARD_USER_ROLES.USER,
          DASHBOARD_USER_ROLES.ACCOUNTANT,
          DASHBOARD_USER_ROLES.AGENT,
        ]}
      >
        <DashboardAssets />
      </AuthProtectedRoutes>
    ),
  },
  {
    path: '/users/:userId/nfts',
    component: (
      <AuthProtectedRoutes
        allowedRoles={[
          DASHBOARD_USER_ROLES.ADMIN,
          DASHBOARD_USER_ROLES.USER,
          DASHBOARD_USER_ROLES.ACCOUNTANT,
          DASHBOARD_USER_ROLES.AGENT,
        ]}
      >
        <NFTsPage />
      </AuthProtectedRoutes>
    ),
  },
  {
    path: '/users/:userId/history',
    component: (
      <AuthProtectedRoutes
        allowedRoles={[
          DASHBOARD_USER_ROLES.ADMIN,
          DASHBOARD_USER_ROLES.USER,
          DASHBOARD_USER_ROLES.ACCOUNTANT,
          DASHBOARD_USER_ROLES.AGENT,
        ]}
      >
        <DashboardTransactions />
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
  { path: '*', component: <Navigate to="/wallets" /> },
];

export { allRoutes, authProtectedRoutes, noVerticalLayoutRoutes, publicRoutes };
