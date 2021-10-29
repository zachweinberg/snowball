interface Props {
  width?: number;
  className?: string;
}

const Cloud: React.FunctionComponent<Props> = ({ width, className }: Props) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 595.28 427"
    width={width}
    className={className}
  >
    <g>
      <polygon points="363.27,165.49 329.31,108.82 329.31,385.57 356.74,385.57 363.27,369.85 		" />
      <polygon points="198.55,200.28 169.24,249.19 198.55,319.69 		" />
      <polygon points="384.22,319.46 413.42,249.19 384.22,200.44 		" />
      <polygon points="308.37,73.86 291.33,45.44 274.4,73.7 274.4,385.57 291.33,385.57 308.37,385.57 		" />
      <polygon points="253.45,108.65 219.5,165.32 219.5,370.08 225.93,385.57 253.45,385.57 		" />
    </g>
  </svg>
);

export default Cloud;
