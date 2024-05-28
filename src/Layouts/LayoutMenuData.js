import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const Navdata = () => {
  const { address, token, contractAddress } = useParams();

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { fetchData } = useSelector((state) => ({
    fetchData: state.fetchData,
  }));

  const [addressSearched, setAddressSearched] = useState('');
  const [isUnsupported, setIsUnsupported] = useState(false);
  const [iscurrentState, setIscurrentState] = useState('');
  const [previousAddress, setPreviousAddress] = useState('');

  useEffect(() => {
    if (address && address !== addressSearched) {
      setPreviousAddress(addressSearched || address);
      setAddressSearched(address);
    }
  }, [address]);

  useEffect(() => {
    const { assets, transactions, performance } = fetchData;
    setIsUnsupported(
      assets?.unsupported ||
        transactions?.unsupported ||
        performance?.unsupported ||
        !address,
    );
  }, [fetchData, address]);

  const filterMenuItems = (menuItems) => {
    if (token) {
      if (user) {
        return menuItems.filter(
          (item) =>
            item.id === 'summary' ||
            item.id === 'userAddresses' ||
            item.id === 'blockchain',
        );
      }
      return menuItems.filter((item) => item.id === 'summary');
    }
    if ((isUnsupported || !contractAddress) && !user) {
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
    link: contractAddress
      ? `/address/${previousAddress}/${page}`
      : `${token ? `/tokens/${token}` : `/address/${address || previousAddress}/${page}`}`,
    click: function (e) {
      e.preventDefault();
      navigate(this.link);
      setIscurrentState(label);
    },
  });

  const createMenuItemAdmin = (id, label, icon, page) => ({
    id,
    label,
    icon,
    link: contractAddress ? `/address/${previousAddress}/${page}` : `/${page}`,
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

  let dashboardLink = '';

  if (token) {
    dashboardLink = `/token/${token}`;
  } else {
    dashboardLink = !isUnsupported ? '' : address ? `/address/${address}/` : '';
  }

  let allMenuItems = [
    createMenuItem('summary', 'Summary', 'bx bx-home', `${dashboardLink}`),
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
