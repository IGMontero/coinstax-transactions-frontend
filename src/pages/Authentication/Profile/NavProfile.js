import React from 'react';
import { useTranslation } from 'react-i18next';
import { CardHeader, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

const NavProfile = ({ activeTab, tabChange }) => {
  const { t } = useTranslation();
  return (
    <CardHeader>
      <Nav
        className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
        role="tablist"
      >
        <NavItem>
          <NavLink
            to="#"
            className={classnames({ active: activeTab === '1' })}
            type="button"
            onClick={() => {
              tabChange('1');
            }}
          >
            <i className="fas fa-home"></i>
            {t('Details')}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            to="#"
            className={classnames({ active: activeTab === '2' })}
            onClick={() => {
              tabChange('2');
            }}
            type="button"
          >
            <i className="far fa-envelope"></i>
            Login Deatils
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            to="#"
            className={classnames({ active: activeTab === '3' })}
            onClick={() => {
              tabChange('3');
            }}
            type="button"
          >
            <i className="far fa-user"></i>
            Plan
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            to="#"
            className={classnames({ active: activeTab === '4' })}
            onClick={() => {
              tabChange('4');
            }}
            type="button"
          >
            <i className="far fa-envelope"></i>
            {t('Access')}
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink
            to="#"
            className={classnames({ active: activeTab === '5' })}
            onClick={() => {
              tabChange('5');
            }}
            type="button"
          >
            <i className="far fa-envelope"></i>
            {t('Close')} {t('Account')}
          </NavLink>
        </NavItem>
      </Nav>
    </CardHeader>
  );
};

export default NavProfile;
