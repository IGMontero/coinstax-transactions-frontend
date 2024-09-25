import React, { useState } from 'react';
import {
  Col,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap';
import { useConnections } from 'wagmi';
import { walletConnectConnectorsData } from '../../common/constants';

//import images

//SimpleBar

const WalletsConnectDropdown = () => {
  //Dropdown Toggle
  const [isWalletsConnectDropdown, setIsWalletsConnectDropdown] =
    useState(false);
  const toggleWalletsConnectDropdown = () => {
    setIsWalletsConnectDropdown(!isWalletsConnectDropdown);
  };

  const connections = useConnections();

  const hasConnections = connections.length > 0;

  //Tab
  const [activeTab, setActiveTab] = useState('1');
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  console.log(walletConnectConnectorsData);

  const renderConnectors = () =>
    walletConnectConnectorsData.map((connector) => {
      const isConnected = connections.find(
        (connection) => connection.connector.id === connector.id,
      );
      const connectorConnected = isConnected?.connector;

      if (!connectorConnected) return;

      // TODO: Implement logo, and disconnect button functionality.

      return (
        <div className="text-reset notification-item d-block dropdown-item position-relative">
          <img
            className="avatar-xs  mb-2"
            src={connectorConnected.logo}
            alt={name}
          />
          {connectorConnected.name}
        </div>
      );
    });

  // if (!hasConnections) {
  //   return null;
  // }

  return (
    <React.Fragment>
      <Dropdown
        isOpen={isWalletsConnectDropdown}
        toggle={toggleWalletsConnectDropdown}
        className="topbar-head-dropdown ms-1 header-item"
      >
        <DropdownToggle
          type="button"
          tag="button"
          className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
        >
          <i className="bx bx-wallet fs-22"></i>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
          <div className="dropdown-head bg-primary bg-pattern rounded-top">
            <div className="p-3">
              <Row className="align-items-center">
                <Col>
                  <h6 className="m-0 fs-16 fw-semibold text-white">
                    Wallets Connected
                  </h6>
                </Col>
              </Row>
            </div>
          </div>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="1" className="py-2 ps-2">
              {!hasConnections ? (
                <div className="text-center pb-5 mt-5">
                  <h6 className="fs-18 fw-semibold lh-base">
                    You have no wallets connected{' '}
                  </h6>
                </div>
              ) : (
                renderConnectors()
              )}
            </TabPane>
          </TabContent>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default WalletsConnectDropdown;
