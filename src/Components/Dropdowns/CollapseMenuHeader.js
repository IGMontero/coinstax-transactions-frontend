import React, { useEffect, useState } from 'react';
import { Collapse, Button, Nav, NavItem } from 'reactstrap';
import { useLogOut } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import WalletsConnectDropdown from '../Common/WalletsConnectDropdown';
import LightDark from '../Common/LightDark';
import NotificationDropdown from '../Common/NotificationDropdown';

const CollapseMenuHeader = ({
  layoutModeType,
  onChangeLayoutMode,
  currentUser,
  handleGetNotifications,
  handleLoadMoreNotifications,
}) => {
  const navigate = useNavigate();
  const logout = useLogOut();

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    try {
      logout();
      navigate('/wallets');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.position-relative')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="position-relative ms-3">
      <Button color="transparent" onClick={toggle} className="p-0">
        <i className="ri-menu-line text-dark fs-20 fw-bold"></i>
      </Button>
      <Collapse
        isOpen={isOpen}
        className="position-absolute bg-light shadow rounded py-2 px-3"
        style={{
          top: '100%',
          right: 0,
          zIndex: 10,
          //   minWidth: '200px',
        }}
      >
        <Nav vertical className="d-flex flex-column align-items-center">
          {currentUser && (
            <NavItem className="mb-n3">
              <NotificationDropdown
                onRefresh={handleGetNotifications}
                handleLoadMoreNotifications={handleLoadMoreNotifications}
              />
            </NavItem>
          )}

          <NavItem className="">
            <WalletsConnectDropdown />
          </NavItem>

          <NavItem className="">
            <LightDark
              layoutMode={layoutModeType}
              onChangeLayoutMode={onChangeLayoutMode}
            />
          </NavItem>
          {currentUser ? (
            <>
              <NavItem className="d-flex align-items-center mt-3 btn btn-icon btn-ghost-dark rounded-circle light-dark-mode">
                {/* <i className="bx bx-user-circle "></i> */}
                <i className="ri-user-line fs-20 text-dark"></i>
              </NavItem>

              <NavItem
                className="d-flex align-items-center mt-3 btn btn-icon btn-ghost-dark rounded-circle light-dark-mode"
                onClick={handleLogout}
              >
                <i className="ri-logout-box-r-line fs-20 text-dark"></i>
              </NavItem>
            </>
          ) : (
            <div className="d-flex align-items-center mt-3">
              <Button
                color="primary"
                size="sm"
                className="btn "
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                color="primary"
                size="sm"
                className="btn ms-2"
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </div>
          )}
        </Nav>
      </Collapse>
    </div>
  );
};

export default CollapseMenuHeader;
