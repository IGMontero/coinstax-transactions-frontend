import React, { useState, useEffect } from 'react';
import { Collapse, Container, NavbarToggler, NavLink } from 'reactstrap';
import Scrollspy from 'react-scrollspy';
import { Link } from 'react-router-dom';

// Import Images
// import logodark from "../../../assets/images/logo-dark.png";
// import logolight from "../../../assets/images/logo-light.png";
import logo from '../../../assets/images/logos/coinstax_logos/logo-dark.png';

const Navbar = () => {
  const [isOpenMenu, setisOpenMenu] = useState(false);
  const [navClass, setnavClass] = useState('');

  const toggle = () => setisOpenMenu(!isOpenMenu);

  useEffect(() => {
    window.addEventListener('scroll', scrollNavigation, true);
  });

  const scrollNavigation = () => {
    var scrollup = document.documentElement.scrollTop;
    if (scrollup > 50) {
      setnavClass('is-sticky');
    } else {
      setnavClass('');
    }
  };

  return (
    <React.Fragment>
      <nav
        className={
          'navbar navbar-expand-lg navbar-landing fixed-top ' + navClass
        }
        id="navbar"
      >
        <Container>
          <div className="mt-2">
            <img
              src={logo}
              className="card-logo card-logo-dark"
              alt="logo dark"
              height="70"
              width="auto"
            />
            <img
              src={logo}
              className="card-logo card-logo-light"
              alt="logo light"
              height="70"
              width="auto"
            />
          </div>

          <NavbarToggler
            className="navbar-toggler py-0 fs-20 text-body"
            onClick={toggle}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="mdi mdi-menu"></i>
          </NavbarToggler>

          <Collapse
            isOpen={isOpenMenu}
            className="navbar-collapse"
            id="navbarSupportedContent"
          >
            <Scrollspy
              offset={-18}
              items={[
                'hero',
                'services',
                'features',
                'plans',
                'reviews',
                'team',
                'contact',
              ]}
              currentClassName="active"
              className="navbar-nav mx-auto mt-2 mt-lg-0"
              id="navbar-example"
            >
              <li className="nav-item">
                <NavLink href="#hero">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink href="#services">Services</NavLink>
              </li>
              <li className="nav-item">
                <NavLink href="#features">Features</NavLink>
              </li>
              <li className="nav-item">
                <NavLink href="#plans">Plans</NavLink>
              </li>
              <li className="nav-item">
                <NavLink href="#reviews">Reviews</NavLink>
              </li>
              <li className="nav-item">
                <NavLink href="#team">Team</NavLink>
              </li>
              <li className="nav-item">
                <NavLink href="#contact">Contact</NavLink>
              </li>
            </Scrollspy>

            <div className="">
              <Link
                to="/login"
                className="btn btn-link fw-medium text-decoration-none text-dark"
              >
                Sign in
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          </Collapse>
        </Container>
      </nav>
    </React.Fragment>
  );
};

export default Navbar;
