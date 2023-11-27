import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
  const history = useNavigate();

  const [isAnalytics, setIsAnalytics] = useState(false);
  const [isResources, setIsResources] = useState(false);
  const [isSummary, setIsSummary] = useState(false);
  const [isSalesDevelopment, setIsSalesDevelopment] = useState(false);
  const [isNewSales, setIsNewSales] = useState(false);
  const [isAccountManagement, setIsAccountManagement] = useState(false);

  const [iscurrentState, setIscurrentState] = useState("Analytics");

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== "Analytics") {
      setIsAnalytics(false);
    }
    if (iscurrentState !== "Resources") {
      setIsResources(false);
    }
    if (iscurrentState !== "Summary") {
      setIsSummary(false);
    }
    if (iscurrentState !== "Sales Development") {
      setIsSalesDevelopment(false);
    }
    if (iscurrentState === "Territory") {
      history("/territory-mapping");
      document.body.classList.add("twocolumn-panel");
    }
  }, [history, iscurrentState, isAnalytics, isResources, isSummary]);

  const menuItems = [
    {
      label: `Welocome to Coinstax`,
      isHeader: true,
    },
    // {
    //     id: "analytics",
    //     label: "Analytics",
    //     icon: "bx bx-chart",
    //     link: "/#",
    //     stateVariables: isAnalytics,
    //     click: function (e) {
    //         e.preventDefault();
    //         setIsAnalytics(!isAnalytics);
    //         setIscurrentState('Analytics');
    //         updateIconSidebar(e);
    //     },
    //     subItems: [
    //         {
    //             id: "summary",
    //             label: "Summary",
    //             link: "#",
    //             parentId: "analytics",
    //             click: function (e) {
    //                 e.preventDefault();
    //                 setIsSummary(!isSummary);
    //             },
    //             stateVariables: isSummary,
    //         },
    //         {
    //             id: "sales-development",
    //             label: "Sales Development",
    //             link: "#",
    //             parentId: "analytics",
    //             isChildItem: true,
    //             click: function (e) {
    //                 e.preventDefault();
    //                 setIsSalesDevelopment(!isSalesDevelopment);
    //             },
    //             stateVariables: isSalesDevelopment,
    //             childItems: [
    //                 { id: 1, label: "Overview", link: "#", parentId: "analytics" },
    //                 { id: 2, label: "Leaders", link: "#", parentId: "analytics" },
    //             ]
    //         },
    //         {
    //             id: "new-sales",
    //             label: "New Sales",
    //             link: "#",
    //             parentId: "analytics",
    //             isChildItem: true,
    //             click: function (e) {
    //                 e.preventDefault();
    //                 setIsNewSales(!isNewSales);
    //             },
    //             stateVariables: isNewSales,
    //             childItems: [
    //                 { id: 1, label: "Overview", link: "#", parentId: "analytics" },
    //                 { id: 2, label: "Leaders", link: "#", parentId: "analytics" },
    //             ]
    //         },
    //         {
    //             id: 'account-management',
    //             label: 'Account Management',
    //             link: '#',
    //             parentId: 'analytics',
    //             isChildItem: true,
    //             click: function (e) {
    //                 e.preventDefault();
    //                 setIsAccountManagement(!isAccountManagement);
    //             },
    //             stateVariables: isAccountManagement,
    //             childItems: [
    //                 { id: 1, label: 'Overview', link: '#', parentId: 'analytics' },
    //                 { id: 2, label: 'Leaders', link: '#', parentId: 'analytics' },
    //             ]
    //         }
    //     ],
    // },
    // {
    //     id: "territory-mapping",
    //     label: "Territory Mapping",
    //     icon: "bx bx-world",
    //     link: "/territory-mapping",
    //     click: function (e) {
    //         e.preventDefault();
    //         setIscurrentState('Territory');
    //     },
    // },
    {
      id: "investment",
      label: "Investment",
      icon: "bx bx-world",
      link: "/territory-mapping",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("Territory");
      },
    },
    {
      id: "favorite",
      label: "Favorites",
      icon: "bx bx-star",
      link: "/territory-mapping",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("Territory");
      },
    },
    {
      id: "territory-mapping",
      label: "Exchange",
      icon: "bx bx-refresh fs-3",
      link: "/territory-mapping",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("Territory");
      },
    },
    {
      id: "configuration",
      label: "Configuration",
      icon: "bx bx-cog",
      link: "/territory-mapping",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("Territory");
      },
    },
    // {
    //     id: "resources",
    //     label: "Resources",
    //     icon: "bx bx-help-circle",
    //     link: "/#",
    //     click: function (e) {
    //         e.preventDefault();
    //         setIsResources(!isResources);
    //         setIscurrentState('Resources');
    //         updateIconSidebar(e);
    //     },
    //     stateVariables: isResources,
    //     subItems: [
    //         {
    //             id: "knowledge-base",
    //             label: "Knowledge Base",
    //             link: "#",
    //             parentId: "resources",
    //         },
    //         {
    //             id: "support",
    //             label: "Support",
    //             link: "#",
    //             parentId: "resources",
    //         }
    //     ]
    // },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
