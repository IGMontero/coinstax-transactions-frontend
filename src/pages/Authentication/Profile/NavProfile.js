import React from 'react';
import { Button, CardHeader, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { PopoverBody, UncontrolledPopover } from 'reactstrap';
const NavProfile = ({
  activeTab,
  tabChange,
  currentUser,
  onInviteCode,
  openModalInviteCode,
  setOpenModalInviteCode,
}) => {
  return (
    <CardHeader>
      <Nav
        className="nav-tabs-custom rounded card-header-tabs border-bottom-0 d-flex  align-items-center justify-content-between"
        role="tablist"
      >
        <div className="d-flex align-items-center justify-content-start">
          {/* <NavItem>
            <NavLink
              className={` fw-semibold text-primary  ${classnames({
                active: activeTab === "1",
              })}`}
              type="button"
              onClick={() => {
                tabChange("1");
              }}
            >
              <i className="fas fa-home"></i>
              DETAILS
            </NavLink>
          </NavItem> */}
          <NavItem>
            <NavLink
              className={`text-primary fw-semibold  ${classnames({
                active: activeTab === '2',
              })}`}
              onClick={() => {
                tabChange('2');
              }}
              type="button"
            >
              <i className="far fa-envelope"></i>
              CHANGE EMAIL
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={`text-primary fw-semibold  ${classnames({
                active: activeTab === '3',
              })}`}
              onClick={() => {
                tabChange('3');
              }}
              type="button"
            >
              <i className="far fa-envelope"></i>
              CHANGE PASSWORD
            </NavLink>
          </NavItem>
        </div>
      </Nav>
    </CardHeader>
  );
};

export default NavProfile;
