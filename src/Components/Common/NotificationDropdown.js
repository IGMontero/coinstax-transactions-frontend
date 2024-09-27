import React, { useState } from 'react';
import {
  Button,
  Col,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Row,
} from 'reactstrap';
import bell from '../../assets/images/svg/bell.svg';
import { markNotificationAsRead } from '../../slices/notifications/thunk';

//SimpleBar
import { useDispatch } from 'react-redux';
import SimpleBar from 'simplebar-react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { markNotificationAsReadAction } from '../../slices/notifications/reducer';

const NotificationDropdown = ({ onRefresh, handleLoadMoreNotifications }) => {
  const dispatch = useDispatch();
  const [isNotificationDropdown, setIsNotificationDropdown] = useState(false);
  const { notificationsInfo } = useSelector((state) => state.notifications);
  const { notifications, total, hasMore, unreadCount } = notificationsInfo;

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(
        (notification) => !notification.seen,
      );
      for (const notification of unreadNotifications) {
        await dispatch(
          markNotificationAsRead({ notificationId: notification.id }),
        );

        await dispatch(markNotificationAsReadAction({ id: notification.id }));
      }
      // onRefresh();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationDropdown(!isNotificationDropdown);
    if (!isNotificationDropdown) {
      markAllAsRead();
    }
  };

  const loadMoreNotifications = () => {
    handleLoadMoreNotifications();
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
          className="btn btn-icon 
         btn-ghost-dark me-1  rounded-circle light-dark-mode"
        >
          <i className="bx bx-bell fs-22"></i>
          {unreadCount > 0 && (
            <span className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">
              {unreadCount}
              <span className="visually-hidden">unread messages</span>
            </span>
          )}
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
          <div className="dropdown-head bg-primary bg-pattern rounded-top">
            <div className="p-3">
              <Row className="align-items-center">
                <Col>
                  <h6 className="m-0 fs-16 fw-semibold text-white">
                    Notifications
                  </h6>
                </Col>
                <div className="col-auto dropdown-tabs">
                  <span className="badge badge-soft-light fs-13">
                    {unreadCount || 0} New
                  </span>
                </div>
              </Row>
            </div>
          </div>

          <div className="p-0">
            {total < 1 ? (
              <div className="w-50 text-center w-sm-50 pt-3 mx-auto">
                <img style={{ maxWidth: 80 }} src={bell} className="img-fluid" alt="no-notifications" />
                <div className="text-center pb-5 mt-2">
                  <h6 className="fs-18 fw-semibold lh-base">
                    You have no new notifications
                  </h6>
                </div>
              </div>
            ) : (
              <SimpleBar
                style={{ width: '100%', maxWidth: '100%', maxHeight: '300px' }}
              >
                {notifications.map((notification, index) => (
                  <div
                    key={index}
                    className="notification-item mt-1 d-flex dropdown-item position-relative align-items-start"
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
                        <i className="mdi mdi-clock-outline"></i>{' '}
                        {moment(notification.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="d-flex justify-content-center">
                  {hasMore && (
                    <Button
                      className=" mb-3 d-flex btn-hover-light justify-content-center align-items-center"
                      color="soft-light"
                      style={{
                        borderRadius: '10px',
                        border: '.5px solid grey',
                      }}
                      onClick={loadMoreNotifications}
                    >
                      <i className="bx bx-eye"></i> View More
                    </Button>
                  )}
                </div>
              </SimpleBar>
            )}
          </div>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default NotificationDropdown;
