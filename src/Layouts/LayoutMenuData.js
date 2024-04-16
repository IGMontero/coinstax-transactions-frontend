import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const Navdata = () => {
  const { address } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { fetchData } = useSelector((state) => ({
    fetchData: state.fetchData,
  }));

  const [addressSearched, setAddressSearched] = useState('');
  const [isUnsupported, setIsUnsupported] = useState(false);

  useEffect(() => {
    if (address && address !== addressSearched) {
      setAddressSearched(address);
    }
  }, [address]);

  useEffect(() => {
    const { assets, transactions, performance } = fetchData;
    setIsUnsupported(
      assets.unsupported || transactions.unsupported || performance.unsupported,
    );
  }, [fetchData]);

  const filterMenuItems = (menuItems) => {
    if (isUnsupported) {
      return menuItems.filter(
        (item) =>
          item.id !== 'assets' &&
          item.id !== 'nfts' &&
          item.id !== 'transactions',
      );
    }
    return menuItems;
  };

  const createMenuItem = (id, label, icon, page) => ({
    id,
    label,
    icon,
    link: `/address/${addressSearched}/${page}`,
    click: function (e) {
      e.preventDefault();
      navigate(link);
      setIscurrentState(label);
    },
  });
  const createMenuItemAdmin = (id, label, icon, page) => ({
    id,
    label,
    icon,
    link: `/${page}`,
    click: function (e) {
      e.preventDefault();
      navigate(link);
      setIscurrentState(label);
    },
  });

  const createMenuHeader = (label) => ({
    id: label.toLowerCase().replace(' ', '-'),
    label,
    isHeader: true,
  });

  const dashboardLink = !isUnsupported
    ? ''
    : addressSearched
      ? `/address/${addressSearched}/`
      : '';

  let allMenuItems = [
    createMenuItem('home', 'Home', 'bx bx-home', `${dashboardLink}`),
    createMenuItem('assets', 'Assets', 'bx bx-coin-stack', 'assets'),
    createMenuItem('nfts', 'NFTs', 'bx bx-coin', 'nfts'),
    createMenuItem('transactions', 'Transactions', 'bx bx-transfer', 'history'),
  ];

  if (user) {
    allMenuItems.push(createMenuHeader('Admin'));
    allMenuItems.push(
      createMenuItemAdmin(
        'blockchain',
        'Blockchain Contracts',
        'bx bx-link fs-3',
        'blockchain-contracts',
      ),
    );
    allMenuItems.push(
      createMenuItemAdmin(
        'userAddresses',
        'User Addresses',
        'bx bx-user fs-3',
        'user-addresses',
      ),
    );
  }

  const filteredMenuItems = filterMenuItems(allMenuItems);

  return <div>{filteredMenuItems}</div>;
};

export default Navdata;
