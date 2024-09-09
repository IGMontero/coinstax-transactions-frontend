import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DASHBOARD_USER_ROLES } from '../common/constants';

const Navdata = () => {
  const location = useLocation();
  const { address, token, contractAddress, userId } = useParams();

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const isAdminRole = user?.role === DASHBOARD_USER_ROLES.ADMIN;
  const isAccountantRole = user?.role === DASHBOARD_USER_ROLES.ACCOUNTANT;
  const isUserRole = user?.role === DASHBOARD_USER_ROLES.USER;
  const isAgentRole = user?.role === DASHBOARD_USER_ROLES.AGENT;

  const isCurrentUserPortfolioSelected =
    location.pathname.includes('portfolio');

  const isUserPortfolio = location.pathname.includes('portfolio') && userId;

  // console.log('user', user);
  const { fetchData } = useSelector((state) => ({
    fetchData: state.fetchData,
  }));

  const [prevAddress, setPrevAddress] = useState(null);
  const [addressSearched, setAddressSearched] = useState(null);
  const [isUnsupported, setIsUnsupported] = useState(false);
  const [iscurrentState, setIscurrentState] = useState('');

  useEffect(() => {
    if (isUserPortfolio) {
      // If a user's portfolio is selected, set prevAddress to that portfolio
      setPrevAddress(`/users/${userId}/portfolio`);
    } else if (isCurrentUserPortfolioSelected) {
      // If only "portfolio" is selected, set it as prevAddress
      setPrevAddress('portfolio');
      setAddressSearched('portfolio');
    } else if (
      !address &&
      !token &&
      !contractAddress &&
      !isUserPortfolio &&
      !prevAddress
    ) {
      // If nothing is selected (neither address nor portfolio), clear the values
      setAddressSearched('');
      setPrevAddress('');
    } else if (address && address !== addressSearched) {
      // If an address is selected, update the values
      setAddressSearched(address);
      setPrevAddress(address);
    }
  }, [
    address,
    token,
    contractAddress,
    user,
    prevAddress,
    isCurrentUserPortfolioSelected,
    isUserPortfolio,
    addressSearched,
    userId,
  ]);

  console.log('prevaddress', prevAddress);

  // useEffect(() => {
  //   if (contractAddress && !address ) {
  //     setAddressSearched(prevAddress);
  //   }
  // }, [contractAddress, address, isCurrentUserPortfolioSelected]);

  useEffect(() => {
    const { assets, transactions, performance } = fetchData;
    setIsUnsupported(
      assets?.unsupported ||
        transactions?.unsupported ||
        performance?.unsupported ||
        !addressSearched,
    );
  }, [fetchData, addressSearched, isCurrentUserPortfolioSelected]);

  const createMenuItem = (id, label, icon, page) => {
    const link = isCurrentUserPortfolioSelected
      ? isUserPortfolio
        ? `/users/${userId}/portfolio/${page}`
        : `/portfolio/${page}`
      : contractAddress && !address
        ? `/address/${prevAddress}/${page}`
        : `${token ? `/tokens/${token}` : `/address/${addressSearched}/${page}`}`;

    return {
      id,
      label,
      icon,
      link,
      click: function (e) {
        e.preventDefault();
        navigate(this.link);
        setIscurrentState(label);
      },
    };
  };

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
          item.id !== 'summary' &&
          item.id !== 'assets' &&
          item.id !== 'nfts' &&
          item.id !== 'transactions',
      );
    }
    return menuItems;
  };

  let allMenuItems = [];

  if (addressSearched || prevAddress) {
    allMenuItems.push(
      createMenuItem('summary', 'Summary', 'bx bx-home', ''),
      createMenuItem('assets', 'Assets', 'bx bx-coin-stack', 'assets'),
      createMenuItem('nfts', 'NFTs', 'bx bx-coin', 'nfts'),
      createMenuItem(
        'transactions',
        'Transactions',
        'bx bx-transfer',
        'history',
      ),
    );
  }

  if (isAdminRole) {
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
      createManageMenu('users', 'Clients', 'bx bx-group fs-3', 'admin/clients'),
    );
    allMenuItems.push(
      createManageMenu('users', 'Users', 'bx bx-group fs-3', 'admin/users'),
    );
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

  if (isAccountantRole) {
    allMenuItems.push(createMenuHeader('Accountant'));
    allMenuItems.push(
      createManageMenu(
        'accountantUsers',
        'Manage Clients',
        'bx bx-user fs-3',
        'clients',
      ),
    );
    allMenuItems.push(
      createManageMenu('agentUsers', 'Agents', 'bx bx-group fs-3', 'agents'),
    );
  }

  if (isAgentRole) {
    allMenuItems.push(createMenuHeader('Agent'));
    allMenuItems.push(
      createManageMenu('users', 'Clients', 'bx bx-group fs-3', 'agent/clients'),
    );
  }

  if (isUserRole || isAccountantRole || isAgentRole) {
    allMenuItems.push(createMenuHeader('Manage'));
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

  const filteredMenuItems = filterMenuItems(allMenuItems);

  return <div>{filteredMenuItems}</div>;
};

export default Navdata;
