import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';
//import images
import avatar1 from '../../assets/images/users/avatar-1.jpg';

import { useLogOut } from '../../hooks/useAuth';
const ProfileDropdown = ({
  currentUser,
  setIsOpenCollapseMenuHeader,

  isOpenCollapseMenuHeader,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const logout = useLogOut();

  const handleLogout = () => {
    try {
      logout();

      navigate('/wallets');
    } catch (error) {
      console.log(error);
    }
  };
  const [userName, setUserName] = useState(user?.email || '');
  const [userAvatar, setUserAvatar] = useState(user?.photoURL || avatar1);

  //Dropdown Toggle
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };

  return (
    <React.Fragment>
      <Dropdown
        isOpen={isProfileDropdown}
        toggle={toggleProfileDropdown}
        className={`ms-1 bg bg-transparent`}
      >
        <DropdownToggle
          tag="button"
          type="button"
          className="btn btn-icon 
         btn-ghost-dark me-1  rounded-circle light-dark-mode"
        >
          <span className="d-flex align-items-center">
            <i className="bx bx-user-circle fs-2"></i>
            {/* <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                {userName}
              </span>
              <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                Admin
              </span>
            </span> */}
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          {/* <h6 className="dropdown-header">Welcome {userName}!</h6> */}
          <DropdownItem className="p-0">
            <Link
              to="/profile"
              className="dropdown-item"
              onClick={() => {
                if (isOpenCollapseMenuHeader) {
                  setIsOpenCollapseMenuHeader(false);
                }
              }}
            >
              <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle">Profile</span>
            </Link>
          </DropdownItem>

          <div className="dropdown-divider"></div>

          <DropdownItem onClick={handleLogout} className="p-0">
            <div className="dropdown-item">
              <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{' '}
              <span className="align-middle" data-key="t-logout">
                Logout
              </span>
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;
