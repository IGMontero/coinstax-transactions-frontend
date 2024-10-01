import React from 'react';
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

export const API_BASE = process.env.REACT_APP_API_URL_BASE;

import eth from '../assets/images/svg/crypto-icons/eth.svg';
import pol from '../assets/images/svg/crypto-icons/polygon.webp';
import bnb from '../assets/images/svg/crypto-icons/binanceLogo.png';
import optimism from '../assets/images/svg/crypto-icons/optimism-seeklogo.png';
import baseMainnet from '../assets/images/svg/crypto-icons/base-mainnet.png';

import coinbaseLogo from '../assets/images/wallets/coinbase.png';
import metamaskLogo from '../assets/images/wallets/metamask.png';
import walletConnectLogo from '../assets/images/wallets/WalletConnect.png';
import cronosLogo from '../assets/images/wallets/cronos.png';

export const networks = [
  {
    key: 'all',
    label: 'All Networks',
    blockchain: 'all',
    icon: (
      <i
        style={{
          fontSize: '30px',
          paddingRight: '8px',
          marginLeft: '-4px',
          marginTop: '-5px',
          marginBottom: '-5px',
        }}
        className="ri-function-line text-primary"
      ></i>
    ),

    withDivider: true,
  },
  {
    key: 'ethereum',
    label: 'Ethereum',
    blockchain: 'ethereum',
    icon: eth,
    iconAlt: 'eth',
    width: 30,
    height: 30,
  },
  {
    key: 'polygon',
    label: 'Polygon',
    blockchain: 'polygon',
    icon: pol,
    iconAlt: 'polygon',
    width: 30,
    height: 30,
  },
  {
    key: 'bsc-mainnet',
    blockchain: 'bnb',
    label: 'BNB Chain',
    icon: bnb,
    iconAlt: 'bnb',
    width: 29,
    height: 29,
  },
  {
    key: 'optimism',
    label: 'Optimism',
    blockchain: 'optimism',
    icon: optimism,
    iconAlt: 'optimism',
    width: 29,
    height: 29,
  },
  {
    key: 'base-mainnet',
    label: 'Base',
    icon: baseMainnet,
    blockchain: 'base',
    iconAlt: 'base-mainnet',
    width: 30,
    height: 30,
  },
  {
    key: 'cronos',
    label: 'Cronos',
    blockchain: 'cronos',
    icon: cronosLogo,
    iconAlt: 'cronos',
    width: 30,
    height: 30,
  },
];

export const INVITECODETYPE = {
  USER_TO_ACCOUNTANT: 'ua',
  ACCOUNTANT_TO_USER: 'au',
  ACCOUNTANT_TO_AGENT: 'aa',
};

export const DASHBOARD_USER_ROLES = {
  USER: 'user',
  ACCOUNTANT: 'accountant',
  ADMIN: 'admin',
  AGENT: 'agent',
};

export const pagesWithoutAddress = [
  '/login',
  '/register',
  '/profile',
  '/forgot-password',
  '/reset-password',
  '/confirm-email',
  '/confirm-email-change',
  '/404',
  '/blockchain-contracts',
  '/user-addresses',
  '/wallets',
  '/wallets/connect',
  '/clients',
  '/admin/clients',
  '/admin/users',
  '/admin/accountants',
  '/agents',
  '/agent/clients',
  '/invite',
];

export const userInviteTypes = {
  USER_TO_ACCOUNTANT: 'ua',
  ACCOUNTANT_TO_USER: 'au',
  ACCOUNTANT_TO_AGENT: 'aa',
};

export const walletConnectConnectorsData = [
  {
    name: 'Metamask',
    id: 'io.metamask',
    urlId: 'metamask',
    uid: 'metamask',
    logo: metamaskLogo,
  },
  {
    name: 'WalletConnect',
    id: 'walletConnect',
    urlId: 'walletconnect',
    uid: 'walletConnect',
    logo: walletConnectLogo,
  },
  {
    name: 'Coinbase Wallet',
    id: 'coinbaseWalletSDK',
    urlId: 'coinbase',
    uid: 'coinbaseWallet',
    logo: coinbaseLogo,
  },
];
