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

const authProtectedRoutes = [
  { path: '/', component: <DashboardInfo /> },
  { path: '/address/:address', component: <DashboardInfo /> },
  { path: '/index', component: <DashboardEcommerce /> },

  //User Profile
  // { path: '/profile', component: <UserProfile /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: '/',
    exact: true,
    component: <Navigate to="/" />,
  },
  { path: '*', component: <Navigate to="/" /> },
];

const publicRoutes = [
  // Authentication Page
  { path: '/', component: <DashboardHome /> },
  { path: '/logout', component: <Logout /> },
  { path: '/login', component: <Login /> },
  { path: '/forgot-password', component: <ForgetPasswordPage /> },
  { path: '/register', component: <Register /> },
];

const homePage = [{ path: '/', component: <DashboardHome /> }];

const allRoutes = [
  { path: '/logout', component: <Logout /> },
  { path: '/login', component: <Login /> },
  { path: '/forgot-password', component: <ForgetPasswordPage /> },
  { path: '/register', component: <Register /> },
  { path: '/tokens/:token', component: <DashboardTokens /> },

  { path: '/contract/:contractAddress', component: <DashboardNFT /> },
  { path: '/address/:address', component: <DashboardInfo /> },
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
  // { path: '/profile', component: <UserProfile /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: '/',
    exact: true,
    component: <Navigate to="/" />,
  },
  { path: '*', component: <Navigate to="/" /> },
];

export { allRoutes, authProtectedRoutes, publicRoutes, homePage };
