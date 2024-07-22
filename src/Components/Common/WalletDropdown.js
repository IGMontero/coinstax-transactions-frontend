import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';

const WalletDropdown = () => {
  const [isWalletDropdowon, setIsWalletDropdown] = useState(false);
  const toggleProfileDropdown = () => {
    setIsWalletDropdown(!isWalletDropdowon);
  };

  return (
    <React.Fragment>
      <Dropdown
        isOpen={isWalletDropdowon}
        toggle={toggleProfileDropdown}
        className="ms-sm-3 h bg bg-transparent"
      >
        <DropdownToggle tag="button" type="button" className="btn">
          <span className="d-flex align-items-center">
            {/* wallet icon  */}
            <div
              className="border rounded-circle header-profile-user"
              style={{
                height: '38px',
                width: '38px',
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
              to={process.env.PUBLIC_URL + '/profile'}
              className="dropdown-item ps-2"
            >
              <i className="ri-add-line text-muted fs-16 align-middle me-2"></i>
              <span className="align-middle">Connect another Wallet </span>
            </Link>
          </DropdownItem>

          <DropdownItem className="p-0">
            <Link
              to={process.env.PUBLIC_URL + '/wallets'}
              className="dropdown-item ps-2"
            >
              <i className="mdi mdi-wallet text-muted fs-16 align-middle me-2"></i>
              <span className="align-middle">Manage Wallets</span>
            </Link>
          </DropdownItem>
          {/* <div className="dropdown-divider"></div> */}
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default WalletDropdown;
