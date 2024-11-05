import React, { useEffect, useState } from 'react';
import { Collapse, Button, Nav, NavItem, Col, Row } from 'reactstrap';
import { useLogOut } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import WalletsConnectDropdown from '../Common/WalletsConnectDropdown';
import LightDark from '../Common/LightDark';
import NotificationDropdown from '../Common/NotificationDropdown';

const CollapseMenuHeader = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const logout = useLogOut();

  const toggle = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    try {
      logout();
      navigate('/wallets');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="collapse-container ms-3">
      <Button color="transparent" onClick={toggle} className="p-0">
        <i className="ri-menu-line text-dark fs-20 fw-bold"></i>
      </Button>
    </div>
  );
};

export default CollapseMenuHeader;
