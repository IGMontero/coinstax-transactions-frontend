import React, { useState } from 'react';
import {
  Col,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Row,
  TabContent,
  TabPane
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

  const renderConnectors = () => walletConnectConnectorsData.map((connector) => {
    const isConnected = connections.find(
      (connection) => connection.connector.id === connector.id,
    );
    const connectorConnected = isConnected?.connector;

    if (!connectorConnected) return;


    // TODO: Implement logo, and disconnect button functionality.

    return (<div className="text-reset notification-item d-block dropdown-item position-relative">
      {connectorConnected.name}
    </div>)

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
          {/* <span
                        className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">3<span
                            className="visually-hidden">unread messages</span>
                            </span> */}
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
            {/* 
            <div className="px-2 pt-2">
              <Nav className="nav-tabs dropdown-tabs nav-tabs-custom">
                <NavItem>
                  <NavLink
                    href="#"
                    className={classnames({ active: activeTab === '1' })}
                    onClick={() => {
                      toggleTab('1');
                    }}
                  >
                    All (0)
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    href="#"
                    className={classnames({ active: activeTab === '2' })}
                    onClick={() => {
                      toggleTab('2');
                    }}
                  >
                    Messages
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    href="#"
                    className={classnames({ active: activeTab === '3' })}
                    onClick={() => {
                      toggleTab('3');
                    }}
                  >
                    Alerts
                  </NavLink>
                </NavItem>
              </Nav>
            </div> */}
          </div>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="1" className="py-2 ps-2">
              {
                !hasConnections ? (
                  <div className="text-center pb-5 mt-5">
                    <h6 className="fs-18 fw-semibold lh-base">
                      You have no wallets connected{' '}
                    </h6>
                  </div>
                ) : renderConnectors()
              }


              {/* <SimpleBar style={{ maxHeight: '300px' }} className="pe-2">
                <div className="text-reset notification-item d-block dropdown-item position-relative">
                  <div className="d-flex">
                    <div className="avatar-xs me-3">
                      <span className="avatar-title bg-soft-info text-info rounded-circle fs-16">
                        <i className="bx bx-badge-check"></i>
                      </span>
                    </div>
                    <div className="flex-1">
                      <Link to="#" className="stretched-link">
                        <h6 className="mt-0 mb-2 lh-base">
                          Your <b>Elite</b> author Graphic Optimization{' '}
                          <span className="text-secondary">reward</span> is
                          ready!
                        </h6>
                      </Link>
                      <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                        <span>
                          <i className="mdi mdi-clock-outline"></i> Just 30 sec
                          ago
                        </span>
                      </p>
                    </div>
                    <div className="px-2 fs-15">
                      <div className="form-check notification-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="messages-notification-check01"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="messages-notification-check01"
                        ></label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-reset notification-item d-block dropdown-item position-relative">
                  <div className="d-flex">
                    <img
                      src={avatar2}
                      className="me-3 rounded-circle avatar-xs"
                      alt="user-pic"
                    />
                    <div className="flex-1">
                      <Link to="#" className="stretched-link">
                        <h6 className="mt-0 mb-1 fs-13 fw-semibold">
                          Angela Bernier
                        </h6>
                      </Link>
                      <div className="fs-13 text-muted">
                        <p className="mb-1">
                          Answered to your comment on the cash flow forecast's
                          graph 🔔.
                        </p>
                      </div>
                      <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                        <span>
                          <i className="mdi mdi-clock-outline"></i> 48 min ago
                        </span>
                      </p>
                    </div>
                    <div className="px-2 fs-15">
                      <div className="form-check notification-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="messages-notification-check02"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="messages-notification-check02"
                        ></label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-reset notification-item d-block dropdown-item position-relative">
                  <div className="d-flex">
                    <div className="avatar-xs me-3">
                      <span className="avatar-title bg-soft-danger text-danger rounded-circle fs-16">
                        <i className="bx bx-message-square-dots"></i>
                      </span>
                    </div>
                    <div className="flex-1">
                      <Link to="#" className="stretched-link">
                        <h6 className="mt-0 mb-2 fs-13 lh-base">
                          You have received <b className="text-success">20</b>{' '}
                          new messages in the conversation
                        </h6>
                      </Link>
                      <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                        <span>
                          <i className="mdi mdi-clock-outline"></i> 2 hrs ago
                        </span>
                      </p>
                    </div>
                    <div className="px-2 fs-15">
                      <div className="form-check notification-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="messages-notification-check03"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="messages-notification-check03"
                        ></label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-reset notification-item d-block dropdown-item position-relative">
                  <div className="d-flex">
                    <img
                      src={avatar8}
                      className="me-3 rounded-circle avatar-xs"
                      alt="user-pic"
                    />
                    <div className="flex-1">
                      <Link to="#" className="stretched-link">
                        <h6 className="mt-0 mb-1 fs-13 fw-semibold">
                          Maureen Gibson
                        </h6>
                      </Link>
                      <div className="fs-13 text-muted">
                        <p className="mb-1">
                          We talked about a project on linkedin.
                        </p>
                      </div>
                      <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                        <span>
                          <i className="mdi mdi-clock-outline"></i> 4 hrs ago
                        </span>
                      </p>
                    </div>
                    <div className="px-2 fs-15">
                      <div className="form-check notification-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="messages-notification-check04"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="messages-notification-check04"
                        ></label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="my-3 text-center">
                  <button
                    type="button"
                    className="btn btn-soft-success waves-effect waves-light"
                  >
                    View All Notifications{' '}
                    <i className="ri-arrow-right-line align-middle"></i>
                  </button>
                </div>
              </SimpleBar> */}
            </TabPane>
            {/* 
            <TabPane tabId="2" className="py-2 ps-2">
              <div className="w-25 w-sm-50 pt-3 mx-auto">
                <img src={bell} className="img-fluid" alt="user-pic" />
              </div>
              <div className="text-center pb-5 mt-2">
                <h6 className="fs-18 fw-semibold lh-base">
                  Hey! You have no wallet connected{' '}
                </h6>
              </div>
             
            </TabPane>
            <TabPane tabId="3" className="py-2 ps-2">
              <div className="w-25 w-sm-50 pt-3 mx-auto">
                <img src={bell} className="img-fluid" alt="user-pic" />
              </div>
              <div className="text-center pb-5 mt-2">
                <h6 className="fs-18 fw-semibold lh-base">
                  Hey! You have no any notifications{' '}
                </h6>
              </div>
            </TabPane> */}
          </TabContent>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default WalletsConnectDropdown;