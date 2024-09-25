import React, { useEffect, useState } from 'react';
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

  const [accountsByConnector, setAccountsByConnector] = useState({});


  const connections = useConnections();

  const hasConnections = connections.length > 0;

  const populateAccountsByConnector = async () => {
    const accountsByConnector = {};

    for (const connection of connections) {
      const accounts = await connection.connector.getAccounts();
      accountsByConnector[connection.connector.id] = accounts;
    }
    setAccountsByConnector(accountsByConnector);
  }


  useEffect(() => {
    populateAccountsByConnector();
  }, [connections]);

  //Tab
  const [activeTab, setActiveTab] = useState('1');
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };


  const renderConnectors = () =>
    walletConnectConnectorsData.map((connector) => {
      const isConnected = connections.find(
        (connection) => connection.connector.id === connector.id,
      );
      const connectorConnected = isConnected?.connector;


      if (!connectorConnected) return;

      const accounts = accountsByConnector[connectorConnected.id];

      // TODO: Implement logo, and disconnect button functionality.

      return (
        <div
          key={connectorConnected.id}
          className="d-flex align-items-start justify-content-between notification-item dropdown-item position-relative"
        >
          <div className="d-flex align-items-start">
            <img
              className="avatar-xs me-3"
              src={connector.logo}
              alt={connectorConnected.name}
            />
            <div>
              <h6 className="mb-1">{connectorConnected.name}</h6>
              <span className="mb-0 text-muted">
                {accounts && accounts.length > 0 && (
                  <small className="fs-6 me-1">
                    {accounts.length} address{accounts.length > 1 && 'es'}
                  </small>
                )}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-ghost-primary align-self-center"
            onClick={() => {
              connectorConnected.disconnect();
              // refresh page
              window.location.reload();
            }}
          >
            <div className="text-danger">
              Disconnect
            </div>
          </button>
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
          className="btn btn-icon 
         btn-ghost-dark rounded-circle light-dark-mode"
        >
          <i className="bx bx-wallet fs-22"></i>
          {hasConnections && (
            <span
              className="position-absolute bottom-0 end-0 translate-middle badge rounded-circle bg-success"
              style={{
                width: "6px",  // Adjust the width for the size of the dot
                height: "6px", // Adjust the height for the size of the dot
                padding: "0",  // Remove any extra padding
                borderRadius: "50%", // Ensure it's a perfect circle
                top: 'auto'
                // border: "2px solid white" // Optional: Add a small border for clarity
              }}
            >
              &nbsp;
            </span>
          )}
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
