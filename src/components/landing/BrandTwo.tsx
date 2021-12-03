import React from "react";

const LogoSlider = [
  {
    img: "logo-12",
    url: "",
  },
  {
    img: "logo-13",
    url: "",
  },
  {
    img: "logo-14",
    url: "",
  },
  {
    img: "logo-15",
    url: "",
  },
  {
    img: "logo-16",
    url: "",
  },
  {
    img: "logo-13",
    url: "",
  },
];

const BrandTwo = () => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      {LogoSlider.map((val, i) => (
        <div
          className="img-meta d-flex align-items-center justify-content-center"
          key={i}
        >
          <a href={val.url}>
            <img src={`images/logo/${val.img}.png`} alt="logo" />
          </a>
        </div>
      ))}
    </div>
  );
};

export default BrandTwo;
