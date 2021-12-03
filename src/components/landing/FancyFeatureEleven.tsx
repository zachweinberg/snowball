import React from "react";

const FancyFeatureEleven = () => {
  return (
    <>
      <div className="block-style-sixteen" style={{ background: "#EBF3F1" }}>
        <div className="container">
          <div className="row">
            <div
              className="col-xl-5 col-lg-6"
              data-aos="fade-right"
              data-aos-duration="1200"
            >
              <h3 className="title">Mobile Application Design.</h3>
              <p>
                Commonly used in the graphic, print & publishing industris for
                previewing visual layout and mockups.
              </p>
            </div>
          </div>
        </div>
        <img
          src="images/assets/screen_02.png"
          alt=""
          className="shapes screen-one"
        />
      </div>
    </>
  );
};

export default FancyFeatureEleven;
