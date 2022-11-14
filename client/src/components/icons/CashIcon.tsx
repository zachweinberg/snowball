interface Props {
  width: number;
}

const CashIcon: React.FunctionComponent<Props> = ({ width }: Props) => {
  return (
    <svg
      x="0px"
      y="0px"
      viewBox="0 0 270 174"
      enableBackground="new 0 0 270 174"
      width={`${width}px`}
      height={`${width}px`}
    >
      <g>
        <rect
          x="3.7"
          y="23.3"
          fill="#FFFFFF"
          stroke="#343434"
          strokeWidth="6"
          strokeMiterlimit="10"
          width="243.9"
          height="147.5"
        />
      </g>
      <g id="Layer_3">
        <circle fill="#D3E167" cx="125.7" cy="97" r="54.9" />
      </g>
      <g id="Layer_4">
        <rect x="21" y="36.1" fill="#343434" width="23.6" height="120" />
        <rect x="264" y="1.1" fill="#343434" width="5.6" height="144.4" />
        <rect x="41.4" y="1" fill="#343434" width="227.4" height="5.6" />
        <g>
          <rect
            x="109.7"
            y="75.7"
            transform="matrix(0.7071 -0.7071 0.7071 0.7071 -18.8404 111.5205)"
            fill="#343434"
            width="31"
            height="5.6"
          />

          <rect
            x="110.8"
            y="113.1"
            transform="matrix(0.7071 -0.7071 0.7071 0.7071 -44.9846 123.271)"
            fill="#343434"
            width="31"
            height="5.6"
          />

          <rect
            x="122.2"
            y="81.1"
            transform="matrix(0.7071 -0.7071 0.7071 0.7071 -31.664 116.696)"
            fill="#343434"
            width="5.6"
            height="31"
          />
        </g>
        <rect x="224.1" y="36.1" fill="#343434" width="5.6" height="120" />
      </g>
    </svg>
  );
};

export default CashIcon;
