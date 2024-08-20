export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

import eth from '../assets/images/svg/crypto-icons/eth.svg';
import pol from '../assets/images/svg/crypto-icons/polygon.webp';
import bnb from '../assets/images/svg/crypto-icons/binanceLogo.png';
import optimism from '../assets/images/svg/crypto-icons/optimism-seeklogo.png';
import baseMainnet from '../assets/images/svg/crypto-icons/base-mainnet.png';

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
  '/invite',
];

export const userInviteTypes = {
  USER_TO_ACCOUNTANT: 'ua',
  ACCOUNTANT_TO_USER: 'au',
  ACCOUNTANT_TO_AGENT: 'aa',
};
