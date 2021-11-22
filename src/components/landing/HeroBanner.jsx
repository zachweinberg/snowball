import React, { useState } from 'react';
import Modal from 'react-modal';
import BrandTwo from './BrandTwo';

Modal.setAppElement('#__next');

const HeroBanner = () => {
  const [isOpen, setIsOpen] = useState(false);

  function toggleModalOne() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="hero-banner-five">
      <div className="container">
        <div className="row">
          <div className="col-xl-10 col-lg-11 col-md-10 m-auto">
            <h1 className="hero-heading" data-aos="fade-up" data-aos-duration="1200">
              Track your <span>stocks</span>
              <br />
              all in one place
            </h1>
            <p
              className="hero-sub-heading"
              data-aos="fade-up"
              data-aos-duration="1200"
              data-aos-delay="100"
            >
              Deski delivered blazing fast performance, striking word soludtion
            </p>
          </div>
        </div>

        <div className="d-sm-flex align-items-center justify-content-center button-group">
          <a
            href="#"
            className="d-flex align-items-center ios-button"
            data-aos="fade-up"
            data-aos-duration="1200"
            data-aos-delay="200"
          >
            <div>
              <strong>App store</strong>
            </div>
          </a>
          <a
            href="#"
            className="d-flex align-items-center windows-button"
            data-aos="fade-up"
            data-aos-duration="1200"
            data-aos-delay="300"
          >
            <img src="images/icon/windows.svg" alt="icon" className="icon" />
            <div>
              <span>Get it on</span>
              <strong>Windows pc</strong>
            </div>
          </a>
        </div>

        <p
          className="sing-in-call"
          data-aos="fade-up"
          data-aos-duration="1200"
          data-aos-delay="400"
        >
          Different Platform? <span onClick={toggleModalOne}>Contact us</span>
        </p>
      </div>

      <div
        className="img-gallery"
        data-aos="fade-up"
        data-aos-duration="1200"
        data-aos-delay="400"
      >
        <div className="container text-center">
          <div className="screen-container">
            <img src="images/assets/main-ui.png" alt="shape" className="main-screen" />
          </div>
        </div>
      </div>

      <img src="images/shape/133.svg" alt="shape" className="shapes shape-one" />
      <img src="images/shape/134.svg" alt="shape" className="shapes shape-two" />

      <div className="partner-slider-two mt-110 md-mt-80">
        <div className="container">
          <p className="text-center">
            Over <span>32K+</span> software businesses growing with Deski.
          </p>
          <div className="partnerSliderTwo">
            <BrandTwo />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onRequestClose={toggleModalOne}
        contentLabel="My dialog"
        className="custom-modal  modal-contact-popup-one"
        overlayClassName="custom-overlay"
        closeTimeoutMS={500}
      >
        <div className="box_inner ">
          <main className="main-body box_inner modal-content clearfix">
            <button className="close" onClick={toggleModalOne}>
              <img src="images/icon/close.svg" alt="close" />
            </button>

            <div className="left-side">
              <div className="d-flex flex-column justify-content-between h-100">
                <div className="row">
                  <div className="col-xl-10 col-lg-8 m-auto">
                    <blockquote>“I never dreamed about success. I worked for it.”</blockquote>
                    <span className="bio">—Estée Lauder</span>
                  </div>
                </div>
                <img src="images/assets/ils_18.svg" alt="" className="illustration mt-auto" />
              </div>
            </div>
          </main>
        </div>
      </Modal>
    </div>
  );
};

export default HeroBanner;
