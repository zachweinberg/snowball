import React from 'react';

const FancyTextBlock = () => {
  return (
    <>
      <div className="row align-items-center">
        <div
          className="col-lg-6 col-md-7 m-auto"
          data-aos="fade-right"
          data-aos-duration="1200"
        >
          <div className="img-meta">
            <img src="images/media/img_72.png" alt="media" className="m-auto" />
            <img src="images/shape/138.svg" alt="shape" className="shapes shape-one" />
          </div>
        </div>

        <div
          className="col-xl-5 col-lg-6 ml-auto"
          data-aos="fade-left"
          data-aos-duration="1200"
          data-aos-delay="100"
        >
          <div className="text-wrapper md-pt-50">
            <p>
              We created over <span>27,000+</span> stunning and quality products over last 5
              years with satisfaction.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FancyTextBlock;
