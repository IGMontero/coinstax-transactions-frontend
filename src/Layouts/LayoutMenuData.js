import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const Navdata = () => {
  const [iscurrentState, setIscurrentState] = useState('Home');

  const { user } = useSelector((state) => state.auth);

  const { assets, transactions, performance } = useSelector(
    (state) => state.fetchData,
  );

  const isUnsupported =
    assets.unsupported || transactions.unsupported || performance.unsupported;

  const { address } = useParams();

  const [addressSearched, setAddressSearched] = useState('');

  useEffect(() => {
    if (address) {
      setAddressSearched(address);
    }
    if (isUnsupported) {
      setAddressSearched('');
    }
  }, [address]);

  // function updateIconSidebar(e) {
  //   if (e && e.target && e.target.getAttribute("subitems")) {
  //     const ul = document.getElementById("two-column-menu");
  //     const iconItems = ul.querySelectorAll(".nav-icon.active");
  //     let activeIconItems = [...iconItems];
  //     activeIconItems.forEach((item) => {
  //       item.classList.remove("active");
  //       var id = item.getAttribute("subitems");
  //       if (document.getElementById(id))
  //         document.getElementById(id).classList.remove("show");
  //     });
  //   }
  // }

  // useEffect(() => {
  //   document.body.classList.remove("twocolumn-panel");
  //   // if (iscurrentState !== "Analytics") {
  //   //   setIsAnalytics(false);
  //   // }
  //   // if (iscurrentState !== "Resources") {
  //   //   setIsResources(false);
  //   // }
  //   // if (iscurrentState !== "Summary") {
  //   //   setIsSummary(false);
  //   // }
  //   // if (iscurrentState !== "Sales Development") {
  //   //   setIsSalesDevelopment(false);
  //   // }
  //   // if (iscurrentState === "Territory") {
  //   //   history("/territory-mapping");
  //   //   document.body.classList.add("twocolumn-panel");
  //   // }
  // }, [history, iscurrentState, isAnalytics, isResources, isSummary]);

  const isAdmin = user;

  const dashboardLink = isUnsupported
    ? '/dashboard'
    : addressSearched
      ? `/address/${addressSearched}/tokens`
      : '/dashboard';

  const adminMenuItems = [
    {
      id: 'home',
      label: 'Home',
      icon: 'bx bx-home',
      link: `${dashboardLink}`,
      click: function (e) {
        e.preventDefault();
        setIscurrentState('Home');
      },
    },

    {
      id: 'assets',
      label: 'Assets',
      icon: 'bx bx-coin-stack',
      link: `/address/${addressSearched}/assets`,
      click: function (e) {
        e.preventDefault();
        setIscurrentState('Assets');
      },
    },
    {
      id: 'nfts',
      label: 'NFTs',
      icon: 'bx bx-coin',
      link: `/address/${addressSearched}/nfts`,
      click: function (e) {
        e.preventDefault();
        setIscurrentState('nfts');
      },
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: 'bx bx-transfer',
      link: `/address/${addressSearched}/history`,
      click: function (e) {
        e.preventDefault();
        setIscurrentState('Transactions');
      },
    },
    {
      label: `Admin`,
      isHeader: true,
    },

    {
      id: 'blockchain',
      label: 'Blockchain Contracts',
      icon: ' bx bx-link fs-3',
      link: '/blockchain-contracts',
      click: function (e) {
        e.preventDefault();
        setIscurrentState('Investment');
      },
    },
    {
      id: 'userAddresses',
      label: 'User Addresses',
      icon: ' bx bx-user fs-3',
      link: '/user-addresses',
      click: function (e) {
        e.preventDefault();
        setIscurrentState('Investment');
      },
    },
  ];

  const userMenuItems = [
    {
      id: 'home',
      label: 'Home',
      icon: 'bx bx-home',
      link: `${dashboardLink}`,
      click: function (e) {
        e.preventDefault();
        setIscurrentState('Home');
      },
    },
    {
      id: 'assets',
      label: 'Assets',
      icon: 'bx bx-coin-stack',
      link: `/address/${addressSearched}/assets`,
      click: function (e) {
        e.preventDefault();
        setIscurrentState('Assets');
      },
    },
    {
      id: 'nfts',
      label: 'NFTs',
      icon: 'bx bx-coin',
      link: `/address/${addressSearched}/nfts`,
      click: function (e) {
        e.preventDefault();
        setIscurrentState('nfts');
      },
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: 'bx bx-transfer',
      link: `/address/${addressSearched}/history`,
      click: function (e) {
        e.preventDefault();
        setIscurrentState('Transactions');
      },
    },
  ];

  const filterMenuItems = (menuItems) => {
    if (
      !addressSearched ||
      isUnsupported
      // && !contractAddress
    ) {
      return menuItems.filter(
        (item) =>
          item.id !== 'assets' &&
          item.id !== 'nfts' &&
          item.id !== 'transactions',
      );
    }
    return menuItems;
  };
  const filteredAdminMenuItems = filterMenuItems(adminMenuItems);
  const filteredUserMenuItems = filterMenuItems(userMenuItems);

  const menuItems = isAdmin ? filteredAdminMenuItems : filteredUserMenuItems;
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
