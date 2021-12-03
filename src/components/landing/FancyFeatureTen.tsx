import React from "react";

const FeaturesContent = [
  {
    bgColor: "#FFEBDB",
    icon: "68",
    title: "Secure & Trusted",
    desc: `Elit esse cillum dolore eu fugiat nulla pariatur`,
    dataDealy: "0",
  },
  {
    bgColor: "#E0F8F8",
    icon: "67",
    title: "Easy Customizable",
    desc: `quis nostrud exerct ullamo ea nisi ut aliqui com dolor`,
    dataDealy: "100",
  },
  {
    bgColor: "#F7EDFF",
    icon: "70",
    title: "Fast Support",
    desc: `Duis aute irure dolor  reprehen derit in volu velit.`,
    dataDealy: "200",
  },
];

const FancyFeatureTen = () => {
  return (
    <div className="row justify-content-center mt-35 md-mt-20">
      {FeaturesContent.map((val, i) => (
        <div
          className="col-lg-4 col-md-6"
          data-aos="fade-up"
          data-aos-duration="1200"
          data-aos-delay={val.dataDealy}
          key={i}
        >
          <div className="block-style-fifteen mt-40">
            <div
              className="icon d-flex align-items-center justify-content-center"
              style={{ background: val.bgColor }}
            >
              <img src={`images/icon/${val.icon}.svg`} alt="icon" />
            </div>
            <h3>{val.title}</h3>
            <p>{val.desc}</p>
            <img src="images/icon/69.svg" alt="icon" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FancyFeatureTen;
