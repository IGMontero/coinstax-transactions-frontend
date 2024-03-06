import React, { useState } from 'react';

const Navdata = () => {
  const [iscurrentState, setIscurrentState] = useState('Investment');

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

  const menuItems = [
    {
      label: `Welocome to Coinstax`,
      isHeader: true,
    },
    // {
    //   id: "investment",
    //   label: "Investment",
    //   icon: "bx bx-world",
    //   link: "/",
    //   click: function (e) {
    //     e.preventDefault();
    //     setIscurrentState("Investment");
    //   },
    // },
    {
      id: 'home',
      label: 'Home',
      icon: 'bx bx-home',
      link: '/dashboard',
      click: function (e) {
        e.preventDefault();
        setIscurrentState('Home');
      },
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
    // {
    //   id: "favorite",
    //   label: "Favorites",
    //   icon: "bx bx-star",
    //   link: "/",
    //   click: function (e) {
    //     e.preventDefault();
    //     setIscurrentState("Favorites");
    //   },
    // },
    // {
    //   id: "exchange",
    //   label: "Exchange",
    //   icon: "bx bx-refresh fs-3",
    //   link: "/",
    //   click: function (e) {
    //     e.preventDefault();
    //     setIscurrentState("Exchange");
    //   },
    // },
    // {
    //   id: "configuration",
    //   label: "Configuration",
    //   icon: "bx bx-cog",
    //   link: "/configuration",
    //   click: function (e) {
    //     e.preventDefault();
    //     setIscurrentState("Configuration");
    //   },
    // },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
