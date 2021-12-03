import React, { useState } from 'react';
import Modal from 'react-modal';
import Scrollspy from 'react-scrollspy';
import Logo from '../ui/Logo';

Modal.setAppElement('#__next');

const logo = 'images/logo/deski_06.svg';

const menuContent = [
  {
    itemName: 'Features',
    itemRoute: '#features',
  },
];

const HeaderLanding = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const [navbar, setNavbar] = useState(false);

  function toggleModalOne() {
    setIsOpen(!isOpen);
  }

  const changeBackground = () => {
    if (window.scrollY >= 90) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  window.addEventListener('scroll', changeBackground);

  return (
    <>
      <div className="theme-main-menu sticky-menu theme-menu-five fixed">
        <div className="d-flex align-items-center justify-content-center">
          <div className="logo">
            <Logo width={170} />
          </div>

          <nav id="mega-menu-holder" className="navbar navbar-expand-lg">
            <div className="container nav-container">
              <div className="mob-header">
                <button className="toggler-menu" onClick={handleClick}>
                  <div className={click ? 'active' : ''}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </button>
              </div>

              <div
                className="navbar-collapse collapse landing-menu-onepage"
                id="navbarSupportedContent"
              >
                <div className="d-lg-flex justify-content-between align-items-center">
                  <Scrollspy
                    className="navbar-nav  main-side-nav font-gordita"
                    items={['features', 'about', 'product', 'pricing', 'feedback']}
                    currentClassName="active"
                    offset={-500}
                  >
                    {menuContent.map((val, i) => (
                      <li key={i} className="nav-item">
                        <a href={val.itemRoute} className="nav-link">
                          {val.itemName}
                        </a>
                      </li>
                    ))}
                  </Scrollspy>
                </div>
              </div>
            </div>
          </nav>
          <div className="right-widget">
            <button className="demo-button" onClick={toggleModalOne}>
              <span>Request A Demo</span>
              <img src="images/icon/user.svg" alt="icon" />
            </button>
          </div>
        </div>
      </div>

      <div className={click ? 'mobile-menu  menu-open' : 'mobile-menu'}>
        <div className="logo order-md-1">
          <img src="images/logo/deski_06.svg" alt="brand" />
          <div className="fix-icon text-dark" onClick={handleClick}>
            <img src="images/icon/close.svg" alt="icon" />
          </div>
        </div>

        <Scrollspy
          className="navbar-nav"
          id="theme-menu-list"
          items={['features', 'about', 'product', 'pricing', 'feedback']}
          currentClassName="active"
          offset={-200}
        >
          {menuContent.map((val, i) => (
            <li key={i} className="nav-item">
              <a href={val.itemRoute} className="nav-link" onClick={handleClick}>
                {val.itemName}
              </a>
            </li>
          ))}
        </Scrollspy>
      </div>
    </>
  );
};

export default HeaderLanding;
