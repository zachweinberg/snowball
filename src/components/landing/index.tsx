import Link from 'next/link';
import React from 'react';
import Logo from '../ui/Logo';
import FancyFeatureEleven from './FancyFeatureEleven';
import FancyFeatureTen from './FancyFeatureTen';
import FancyTextBlock21 from './FancyTextBlock';
import Footer from './Footer';
import HeroBanner from './HeroBanner';
import Pricing from './Pricing';

const ProductLanding = () => {
  return (
    <div className="landing-page">
      <div className="main-page-wrapper">
        <div
          style={{
            backgroundColor: '#fff',
            padding: '13px 140px',
            borderBottom: '1px solid #EBEBEE',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Logo width={150} />
            <div style={{ fontWeight: 500 }}>
              <Link href="/login">
                <a style={{ marginRight: '16px' }}>Login</a>
              </Link>
              <Link href="/signup">
                <a
                  style={{
                    backgroundColor: '#141414',
                    color: '#fff',
                    padding: '12px',
                    borderRadius: '10px',
                  }}
                >
                  Sign up
                </a>
              </Link>
            </div>
          </div>
        </div>

        <HeroBanner />

        <div className="fancy-feature-ten pt-100 md-pt-70" id="features">
          <div className="bg-wrapper">
            <div className="container">
              <div className="row justify-content-between align-items-center">
                <div className="col-md-6" data-aos="fade-right" data-aos-duration="1200">
                  <div className="title-style-six">
                    <h2>
                      The <span>Product</span> we work with.
                    </h2>
                  </div>
                </div>

                <div
                  className="col-lg-5 col-md-6"
                  data-aos="fade-left"
                  data-aos-duration="1200"
                >
                  <p className="sub-text pt-30 pb-30">
                    Commonly used in the graphic, print & publishing industris for previewing
                    visual mockups.
                  </p>
                </div>
              </div>
              <FancyFeatureTen />
            </div>
          </div>
        </div>

        <div className="fancy-text-block-twentyOne pt-170 md-pt-100" id="about">
          <div className="container">
            <FancyTextBlock21 />
          </div>
        </div>

        <div className="fancy-feature-eleven pt-130 md-pt-80" id="product">
          <div className="inner-container">
            <div className="container">
              <div className="row">
                <div className="col-xl-8 col-lg-10 col-md-9 m-auto">
                  <div className="title-style-six text-center">
                    <h6>Our Product</h6>
                    <h2>
                      We’ve helping <span>customer</span> globally now.
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <FancyFeatureEleven />
          </div>
        </div>

        <div className="pricing-section-four pt-200 md-pt-100" id="pricing">
          <div className="container">
            <div className="row">
              <div className="col-xl-10  m-auto">
                <div className="title-style-six text-center">
                  <h2>
                    Solo, Agency or Team? We’ve got you <span>covered.</span>
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <Pricing />
        </div>

        <div className="fancy-short-banner-six mt-150 md-mt-80">
          <img src="images/shape/143.svg" alt="shape" className="shapes shape-one" />
          <div className="container">
            <div className="row">
              <div
                className="col-xl-9 col-lg-11 m-auto"
                data-aos="fade-up"
                data-aos-duration="1200"
              >
                <div className="title-style-six text-center">
                  <h2>
                    love our product? <br />
                    <span>Save $20</span> by grab it today.
                  </h2>
                </div>
              </div>
            </div>
            <p data-aos="fade-up" data-aos-duration="1200" data-aos-delay="100">
              Try it risk free — we don’t charge cancellation fees.
            </p>
            <a
              href="https://themeforest.net/item/deski-saas-software-react-template/33799794"
              className="theme-btn-seven"
              data-aos="fade-up"
              data-aos-duration="1200"
              data-aos-delay="150"
            >
              Get Started
            </a>
          </div>
        </div>

        <footer className="theme-footer-five mt-130 md-mt-100">
          <div className="inner-container">
            <div className="container">
              <Footer />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ProductLanding;
