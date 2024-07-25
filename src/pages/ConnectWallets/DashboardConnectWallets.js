import React from 'react';
import Helmet from '../../Components/Helmet/Helmet';
import SearchBar from '../../Components/SearchBar/SearchBar';
import ledgerWallet from '../../assets/images/wallets/ledgerWallet.svg';
import walletConnect from '../../assets/images/wallets/WalletConnect.png';
import zerionWallet from '../../assets/images/wallets/zerionWallet.svg';
const DashboardConnectWallets = () => {
  const wallets = [
    {
      icon: zerionWallet,
      name: 'Zerion Wallet',
      link: '',
      handler: () => {},
    },
    {
      icon: walletConnect,
      name: 'WalletConnect',
      link: '',
      handler: () => {},
    },

    {
      icon: ledgerWallet,
      name: 'Ledger',
      link: '',
      handler: () => {},
    },
  ];

  return (
    <div className="page-content ">
      <Helmet title="Connect Wallets" />
      <div className="d-flex justify-content-center flex-column align-items-center">
        <div>
          <h1>Connect to ChainGlance</h1>
        </div>
        <div className="d-flex my-5">
          {wallets.map((wallet, index) => (
            <div
              key={index}
              className="d-flex btn-hover-light p-2 rounded cursor-pointer flex-column mx-4 align-items-center
            
            "
            >
              <img
                className="img-fluid avatar-md mb-2"
                src={wallet.icon}
                alt={wallet.name}
              />
              {wallet.name}
            </div>
          ))}
        </div>
        <div className="w-50 py-5">
          <span>Track any wallet</span>
          <SearchBar />
        </div>
      </div>
    </div>
  );
};

export default DashboardConnectWallets;
