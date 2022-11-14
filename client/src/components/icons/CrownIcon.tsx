interface Props {
  width: number;
}

const CrownIcon: React.FunctionComponent<Props> = ({ width }: Props) => {
  return (
    <svg
      width={`${width}px`}
      height={`${width}px`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="fill-current text-evergreen"
    >
      <path d="M3 16l-3-10 7.104 4 4.896-8 4.896 8 7.104-4-3 10h-18zm0 2v4h18v-4h-18z" />
    </svg>
  );
};

export default CrownIcon;
