import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DASHBOARD_USER_ROLES } from '../common/constants';
import { useDispatch } from 'react-redux';
import {
  setPrevAddress,
  setAddressSearched,
} from '../slices/layoutMenuData/reducer';

const Navdata = () => {
  const location = useLocation();
  const { address, token, contractAddress, userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const isAdminRole = user?.role === DASHBOARD_USER_ROLES.ADMIN;
  const isAccountantRole = user?.role === DASHBOARD_USER_ROLES.ACCOUNTANT;
  const isAgentRole = user?.role === DASHBOARD_USER_ROLES.AGENT;

  const isCurrentUserPortfolioSelected =
    location.pathname.includes('portfolio');

  const isUserPortfolio = location.pathname.includes('portfolio') && userId;

  // console.log('user', user);
  const { fetchData } = useSelector((state) => ({
    fetchData: state.fetchData,
  }));
  const { prevAddress, addressSearched } = useSelector(
    (state) => state.layoutMenuData,
  );

  // const state = useSelector((state) => state);


  // const [addressSearched, setAddressSearched] = useState(null);
  const [isUnsupported, setIsUnsupported] = useState(false);
  const [iscurrentState, setIscurrentState] = useState('');

  useEffect(() => {
    if (isUserPortfolio) {
      dispatch(setPrevAddress(`/users/${userId}/portfolio`));
    } else if (isCurrentUserPortfolioSelected) {
      dispatch(setPrevAddress('portfolio'));
      dispatch(setAddressSearched('portfolio'));
    } else if (
      !address &&
      !token &&
      !contractAddress &&
      !isUserPortfolio &&
      !prevAddress
    ) {
      dispatch(setAddressSearched(''));
      dispatch(setPrevAddress(''));
    } else if (address && address !== addressSearched) {
      // If an address is selected, update the values
      dispatch(setAddressSearched(address));
      dispatch(setPrevAddress(address));
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

  // useEffect(() => {
  //   dispatch(setPrevAddress(null));
  //   dispatch(setAddressSearched(null));
  //   setIscurrentState('');
  // }, [user]);

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
    const prevAddressPortfolio = prevAddress.includes('portfolio');

    const link = isCurrentUserPortfolioSelected
      ? isUserPortfolio
        ? `/users/${userId}/portfolio/${page}`
        : `/portfolio/${page}`
      : contractAddress && !address
        ? `/address/${prevAddress}/${page}`
        : `${token
          ? `/tokens/${token}`
          : prevAddressPortfolio
            ? `/${addressSearched}/${page}`
            : `/address/${addressSearched}/${page}`
        }`;

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
    // allMenuItems.push(createMenuHeader('Wallets'));
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

  // allMenuItems.push(createMenuHeader('Manage'));
  // allMenuItems.push(
  //   createManageMenu('usersWallets', 'Wallets', 'bx bx-wallet fs-3', 'wallets'),
  // );

  const filteredMenuItems = filterMenuItems(allMenuItems);

  return <div>{filteredMenuItems}</div>;
};

export default Navdata;
