import React, { useState } from 'react';
import {
  Col,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Row
} from 'reactstrap';
import bell from '../../assets/images/svg/bell.svg';
import { markNotificationAsRead } from '../../slices/notifications/thunk';

//SimpleBar
import { useDispatch } from 'react-redux';
import SimpleBar from 'simplebar-react';

const NotificationDropdown = ({ notifications, total, onRefresh }) => {
  //Dropdown Toggle
  const dispatch = useDispatch();
  const [isNotificationDropdown, setIsNotificationDropdown] = useState(false);
  const toggleNotificationDropdown = () => {
    setIsNotificationDropdown(!isNotificationDropdown);
  };

  //Tab
  const [activeTab, setActiveTab] = useState('1');
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await dispatch(markNotificationAsRead({ notificationId }));
      onRefresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <Dropdown
        isOpen={isNotificationDropdown}
        toggle={toggleNotificationDropdown}
        className="topbar-head-dropdown ms-1 header-item"
      >
        <DropdownToggle
          type="button"
          tag="button"
          className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
        >
          <i className="bx bx-bell fs-22"></i>
          {total > 0 && (
            <>
              <span className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">
                {total}
                <span className="visually-hidden">unread messages</span>
              </span>
            </>
          )}
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
          <div className="dropdown-head bg-primary bg-pattern rounded-top">
            <div className="p-3">
              <Row className="align-items-center">
                <Col>
                  <h6 className="m-0 fs-16 fw-semibold text-white">
                    {' '}
                    Notifications{' '}
                  </h6>
                </Col>
                <div className="col-auto dropdown-tabs">
                  <span className="badge badge-soft-light fs-13">
                    {' '}
                    {total || 0} New
                  </span>
                </div>
              </Row>
            </div>

            {/* <div className="px-2 pt-2">
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

          <div className="p-0">
            {total < 1 ? (
              <>
                <div className="w-25 w-sm-50 pt-3 mx-auto">
                  <img src={bell} className="img-fluid" alt="user-pic" />
                </div>
                <div className="text-center pb-5 mt-2">
                  <h6 className="fs-18 fw-semibold lh-base">
                    Hey! You have no notifications{' '}
                  </h6>
                </div>
              </>
            ) : (
              <SimpleBar
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  maxHeight: '300px',
                  overflowY: 'auto',
                }}
                className=""
              >
                {notifications.map((notification, index) => {
                  return (
                    <div
                      key={notification.Id}
                      className="text-reset notification-item mt-1 d-flex dropdown-item position-relative align-items-start"
                      style={{ marginBottom: '10px' }}
                    >
                      <div className="avatar-xs me-3">
                        <span className="avatar-title bg-soft-info text-info rounded-circle fs-16">
                          <i className="bx bx-bell"></i>
                        </span>
                      </div>
                      <div className="flex-1">
                        <a
                          href={notification?.other?.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="stretched-link text-decoration-none"
                        >
                          <h6
                            className="mt-0 mb-2 lh-base"
                            style={{ wordBreak: 'break-word' }}
                          >
                            {notification.text}
                          </h6>
                        </a>
                        <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                          <span>
                            <i className="mdi mdi-clock-outline"></i>{' '}
                            {new Date(
                              notification.createdAt,
                            ).toLocaleTimeString()}
                          </span>
                        </p>
                      </div>
                      <div className="px-2 fs-15">
                        <div className="form-check notification-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id={`notification-check-${index}`}
                            checked={notification.Seen}
                            onChange={() => handleMarkAsRead(notification.Id)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`notification-check-${index}`}
                          ></label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </SimpleBar>
            )}
          </div>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default NotificationDropdown;
