import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { DASHBOARD_USER_ROLES } from '../common/constants';

const Navdata = () => {
  const { address, token, contractAddress } = useParams();

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const isAdmin = user?.role === DASHBOARD_USER_ROLES.ADMIN;

  const isAccountant = user?.role === DASHBOARD_USER_ROLES.ACCOUNTANT;
  const isUser = user?.role === DASHBOARD_USER_ROLES.USER;

  // console.log('user', user);
  const { fetchData } = useSelector((state) => ({
    fetchData: state.fetchData,
  }));

  const [prevAddress, setPrevAddress] = useState('');
  const [addressSearched, setAddressSearched] = useState('');
  const [isUnsupported, setIsUnsupported] = useState(false);
  const [iscurrentState, setIscurrentState] = useState('');

  useEffect(() => {
    if (address && address !== addressSearched) {
      setAddressSearched(address);
      setPrevAddress(address);
    }
  }, [address]);

  useEffect(() => {
    if (!address && contractAddress) {
      setAddressSearched(prevAddress);
    }
  }, [contractAddress, address]);

  useEffect(() => {
    const { assets, transactions, performance } = fetchData;
    setIsUnsupported(
      assets?.unsupported ||
      transactions?.unsupported ||
      performance?.unsupported ||
      !addressSearched,
    );
  }, [fetchData, addressSearched]);

  const createMenuItem = (id, label, icon, page) => ({
    id,
    label,
    icon,
    link:
      contractAddress && !address
        ? `/address/${prevAddress}/${page}`
        : `${token ? `/tokens/${token}` : `/address/${addressSearched}/${page}`}`,
    click: function (e) {
      e.preventDefault();
      navigate(this.link);
      setIscurrentState(label);
    },
  });

  const createManageMenu = (id, label, icon, page) => ({
    id,
    label,
    icon,
    link: `/${page}`,
    click: function (e) {
      e.preventDefault();
      navigate(this.link);
      setIscurrentState(label);
    },
  });

  const createMenuHeader = (label) => ({
    id: label.toLowerCase().replace(' ', '-'),
    label,
    isHeader: true,
  });

  const filterMenuItems = (menuItems) => {
    if (isUnsupported || token) {
      return menuItems.filter(
        (item) =>
          item.id !== 'assets' &&
          item.id !== 'nfts' &&
          item.id !== 'transactions',
      );
    }
    return menuItems;
  };

  let allMenuItems = [];

  if (address || prevAddress) {
    allMenuItems = [
      createMenuItem('summary', 'Summary', 'bx bx-home', ''),
      createMenuItem('assets', 'Assets', 'bx bx-coin-stack', 'assets'),
      createMenuItem('nfts', 'NFTs', 'bx bx-coin', 'nfts'),
      createMenuItem(
        'transactions',
        'Transactions',
        'bx bx-transfer',
        'history',
      ),
    ];
  }
  // let allMenuItems = [
  //   createMenuItem('summary', 'Summary', 'bx bx-home', ''),
  //   createMenuItem('assets', 'Assets', 'bx bx-coin-stack', 'assets'),
  //   createMenuItem('nfts', 'NFTs', 'bx bx-coin', 'nfts'),
  //   createMenuItem('transactions', 'Transactions', 'bx bx-transfer', 'history'),
  // ];

  if (isAdmin) {
    allMenuItems.push(createMenuHeader('Admin'));
    allMenuItems.push(
      createManageMenu(
        'blockchain',
        'Blockchain Contracts',
        'bx bx-link fs-3',
        'blockchain-contracts',
      ),
    );
    allMenuItems.push(
      createManageMenu(
        'userAddresses',
        'User Addresses',
        'bx bx-user fs-3',
        'user-addresses',
      ),
    );
    allMenuItems.push(
      createManageMenu(
        'accountantUsers',
        'Manage Clients',
        'bx bx-user fs-3',
        'clients',
      ),
    );
  }


  if (isUser || isAccountant) {
    allMenuItems.push(createMenuHeader('Wallets'));
    allMenuItems.push(
      createManageMenu(
        'connectWallet',
        'Connect Wallet',
        'bx bx-add-to-queue fs-3',
        'wallets/connect',
      ),
    );
    allMenuItems.push(
      createManageMenu(
        'usersWallets',
        'Manage Wallets',
        'bx bx-wallet fs-3',
        'wallets',
      ),
    );
  }

  if (isAccountant) {
    allMenuItems.push(createMenuHeader('Accountant'));
    allMenuItems.push(
      createManageMenu(
        'accountantUsers',
        'Manage Clients',
        'bx bx-user fs-3',
        'clients',
      ),
    );
  }

  const filteredMenuItems = filterMenuItems(allMenuItems);

  return <div>{filteredMenuItems}</div>;
};

export default Navdata;
