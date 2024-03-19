import React, { useState, useEffect } from 'react';
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
import { logoutUser } from '../../slices/thunks';

import { logout } from '../../slices/auth2/reducer';
import Swal from 'sweetalert2';
const ProfileDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      Swal.fire({
        title: 'Logged Out!',
        text: 'You have been logged out successfully!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const [userName, setUserName] = useState(user?.email || 'Admin');
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
        className="ms-sm-3 h bg bg-transparent"
      >
        <DropdownToggle tag="button" type="button" className="btn">
          <span className="d-flex align-items-center">
            <img
              className="rounded-circle header-profile-user"
              src={userAvatar || avatar1}
              alt="Header Avatar"
            />
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
          <h6 className="dropdown-header">Welcome {userName}!</h6>
          <DropdownItem className="p-0">
            <Link
              to={process.env.PUBLIC_URL + '/profile'}
              className="dropdown-item"
            >
              <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle">Profile</span>
            </Link>
          </DropdownItem>

          <DropdownItem className="p-0">
            <Link to={process.env.PUBLIC_URL + '#'} className="dropdown-item">
              <i className="mdi mdi-lifebuoy text-muted fs-16 align-middle me-1"></i>{' '}
              <span className="align-middle">Help</span>
            </Link>
          </DropdownItem>
          <div className="dropdown-divider"></div>
          <DropdownItem className="p-0">
            <Link to={process.env.PUBLIC_URL + '#'} className="dropdown-item">
              {/* <span
                                className="badge bg-soft-success text-success mt-1 float-end">New</span> */}
              <i className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i>{' '}
              <span className="align-middle">Settings</span>
            </Link>
          </DropdownItem>

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
