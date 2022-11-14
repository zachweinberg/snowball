interface Props {
  width: number;
}

const StockIcon: React.FunctionComponent<Props> = ({ width }: Props) => {
  return (
    <svg
      x="0px"
      y="0px"
      viewBox="0 0 251 203"
      enableBackground="new 0 0 251 203"
      width={`${width}px`}
      height={`${width}px`}
    >
      <g>
        <rect
          x="3.6"
          y="3.4"
          fill="#FFFFFF"
          stroke="#343434"
          strokeWidth="6"
          strokeMiterlimit="10"
          width="243.9"
          height="169.5"
        />
      </g>
      <g id="Layer_4">
        <g>
          <circle fill="#343433" cx="161.6" cy="74.4" r="33.5" />
          <rect x="24.9" y="40.8" fill="#343434" width="82.1" height="5.6" />
          <rect x="24.9" y="66.4" fill="#343434" width="70.9" height="5.6" />
          <rect x="24.9" y="92" fill="#343434" width="70.9" height="5.6" />
          <rect x="24.9" y="117.6" fill="#343434" width="70.9" height="5.6" />
          <rect x="221.1" y="19.9" fill="#343434" width="5.6" height="136" />
        </g>
        <polyline
          fill="#D3E168"
          points="134,121.9 134,202.6 162.3,182.8 189.1,202.6 189.1,121.9 	"
        />
      </g>
    </svg>
  );
};

export default StockIcon;
