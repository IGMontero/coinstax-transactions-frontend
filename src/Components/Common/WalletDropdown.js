import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';
import { DASHBOARD_USER_ROLES } from '../../common/constants';

const WalletDropdown = () => {
  const { user } = useSelector((state) => state.auth);

  const isUserOrNoUser = user?.role === DASHBOARD_USER_ROLES.USER || !user;
  const isAdminOrAccountant =
    user?.role === DASHBOARD_USER_ROLES.ADMIN ||
    user?.role === DASHBOARD_USER_ROLES.ACCOUNTANT;

  const [isWalletDropdowon, setIsWalletDropdown] = useState(false);
  const toggleProfileDropdown = () => {
    setIsWalletDropdown(!isWalletDropdowon);
  };

  return (
    <React.Fragment>
      <Dropdown
        isOpen={isWalletDropdowon}
        toggle={toggleProfileDropdown}
        className="bg bg-transparent"
      >
        <DropdownToggle tag="button" type="button" className="btn">
          <span className="d-flex align-items-center">
            {/* wallet icon  */}
            <div
              className="border  btn-ghost-dark rounded-circle header-profile-user"
              style={{
                height: '35px',
                width: '35px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <i className="mdi mdi-wallet fs-4 align-middle text-dark"></i>
            </div>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem className="p-0 ">
            <Link
              to={process.env.PUBLIC_URL + '/wallets/connect'}
              className="dropdown-item ps-2"
            >
              <i className="ri-add-line text-muted fs-16 align-middle me-2"></i>
              <span className="align-middle">Connect another Wallet </span>
            </Link>
          </DropdownItem>
          {user && (
            <DropdownItem className="p-0">
              <Link
                to={
                  process.env.PUBLIC_URL +
                  (isUserOrNoUser ? '/wallets' : '/clients')
                }
                className="dropdown-item ps-2"
              >
                <i className="mdi mdi-wallet text-muted fs-16 align-middle me-2"></i>
                <span className="align-middle">
                  Manage {isAdminOrAccountant ? 'Clients' : 'Wallets'}
                </span>
              </Link>
            </DropdownItem>
          )}
          {/* <div className="dropdown-divider"></div> */}
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default WalletDropdown;
