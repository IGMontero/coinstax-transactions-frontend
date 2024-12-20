import React from 'react';
export const isDevelopment = config.isDevelopment
export const isProduction = config.isProduction

export const API_BASE = config.api.API_URL

import eth from '../assets/images/svg/crypto-icons/eth.svg';
import pol from '../assets/images/svg/crypto-icons/polygon.webp';
import bnb from '../assets/images/svg/crypto-icons/binanceLogo.png';
import optimism from '../assets/images/svg/crypto-icons/optimism-seeklogo.png';
import baseMainnet from '../assets/images/svg/crypto-icons/base-mainnet.png';
import gnosisMainnet from '../assets/images/svg/crypto-icons/gnosis-mainnet.svg';
import avaxMainnet from '../assets/images/svg/crypto-icons/avalanche.png';
import celoIcon from '../assets/images/svg/crypto-icons/celo.png';

import coinbaseLogo from '../assets/images/wallets/coinbase.png';
import metamaskLogo from '../assets/images/wallets/metamask.png';
import walletConnectLogo from '../assets/images/wallets/WalletConnect.png';
import cronosLogo from '../assets/images/wallets/cronos.png';
import config from '../config';

const SupportedBlockchains = {
  ALL: 'all',
  ETHEREUM: 'ethereum',
  POLYGON: 'polygon',
  BNB: 'bnb',
  OPTIMISM: 'optimism',
  BASE: 'base',
  CRONOS: 'cronos',
  GNOSIS: 'gnosis',
  AVALANCHE: 'avax',
  CELO: 'celo',
};

const blockchainLinks = {
  ethereum: 'https://etherscan.io/tx',
  bnb: 'https://bscscan.com/tx',
  polygon: 'https://polygonscan.com/tx',
  optimism: 'https://optimistic.etherscan.io/tx',
  base: 'https://basescan.org/tx',
  cronos: 'https://cronoscan.com/tx',
  gnosis: 'https://gnosisscan.io/tx',
  avalanche: 'https://snowscan.xyz/tx',
  celo: 'https://celoscan.io/tx',
};

export const BlockchainMetadata = {
  [SupportedBlockchains.ALL]: {
    label: 'All Networks',
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
    key: 'all',
    blockchain: 'all',
  },
  [SupportedBlockchains.ETHEREUM]: {
    label: 'Ethereum',
    icon: eth,
    iconAlt: 'eth',
    key: 'eth-mainnet',
    width: 30,
    height: 30,
    blockchainLink: blockchainLinks.ethereum,
    blockchain: 'ethereum',
  },
  [SupportedBlockchains.POLYGON]: {
    label: 'Polygon',
    icon: pol,
    iconAlt: 'polygon',
    key: 'polygon',
    width: 30,
    height: 30,
    blockchainLink: blockchainLinks.polygon,
    blockchain: 'polygon',
  },
  [SupportedBlockchains.BNB]: {
    label: 'BNB Chain',
    icon: bnb,
    iconAlt: 'bnb',
    key: 'bsc-mainnet',
    width: 29,
    height: 29,
    blockchainLink: blockchainLinks.bnb,
    blockchain: 'bnb',
  },
  [SupportedBlockchains.OPTIMISM]: {
    label: 'Optimism',
    icon: optimism,
    iconAlt: 'optimism',
    key: 'optimism',
    width: 29,
    height: 29,
    blockchainLink: blockchainLinks.optimism,
    blockchain: 'optimism',
  },
  [SupportedBlockchains.BASE]: {
    label: 'Base',
    icon: baseMainnet,
    iconAlt: 'base-mainnet',
    key: 'base-mainnet',
    width: 30,
    height: 30,
    blockchainLink: blockchainLinks.base,
    blockchain: 'base',
  },
  [SupportedBlockchains.CRONOS]: {
    label: 'Cronos',
    icon: cronosLogo,
    iconAlt: 'cronos',
    key: 'cronos',
    width: 30,
    height: 30,
    blockchainLink: blockchainLinks.cronos,
    blockchain: 'cronos',
  },
  [SupportedBlockchains.GNOSIS]: {
    label: 'Gnosis',
    icon: gnosisMainnet,
    iconAlt: 'gnosis-mainnet',
    key: 'gnosis-mainnet',
    width: 30,
    height: 30,
    blockchainLink: blockchainLinks.gnosis,
    blockchain: 'gnosis',
  },

  [SupportedBlockchains.CELO]: {
    label: 'Celo',
    icon: celoIcon,
    iconAlt: 'celo',
    key: 'celo-mainnet',
    width: 30,
    height: 30,
    blockchainLink: blockchainLinks.celo,
    blockchain: 'celo',
  },

  [SupportedBlockchains.AVALANCHE]: {
    label: 'Avalanche',
    icon: avaxMainnet,
    iconAlt: '',
    key: 'avalanche-mainnet',
    width: 30,
    height: 30,
    blockchainLink: blockchainLinks.avalanche,
    blockchain: 'avalanche',
  },
};

export const networks = Object.values(BlockchainMetadata);

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
  '/complete-profile',
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
  // {
  //   name: 'MetaMask',
  //   id: 'io.metamask',
  //   urlId: 'metamask',
  //   uid: 'metamask',
  //   logo: metamaskLogo,
  // },
  {
    name: 'MetaMask',
    id: "metaMaskSDK",
    urlId: 'metamask',
    // uid: 'metamask',
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
