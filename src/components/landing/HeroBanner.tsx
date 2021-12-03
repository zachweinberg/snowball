import React, { useState } from 'react';
import Modal from 'react-modal';
import Typewriter from 'typewriter-effect';
import BrandTwo from './BrandTwo';

Modal.setAppElement('#__next');

const HeroBanner = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [wordToType, setWordToType] = useState('');

  return (
    <div className="py-52">
      <div className="space-y-5 flex flex-col items-center">
        <p className="text-7xl font-semibold">Track all of your</p>

        <Typewriter
          options={{
            wrapperClassName:
              'text-8xl font-semibold text-transparent bg-clip-text bg-gradient-to-r to-purple from-evergreen',
            loop: true,
            strings: ['stocks', 'crypto', 'cash', 'real estate'],
            autoStart: true,
            deleteSpeed: 40,
            delay: 60,
          }}
        />
        <p className="text-7xl font-semibold">all in one place.</p>
      </div>

      <div className="items-center justify-center mt-32">
        <a href="/signup" className="bg-dark text-white p-3">
          Get Started
        </a>
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
    </div>
  );
};

export default HeroBanner;
