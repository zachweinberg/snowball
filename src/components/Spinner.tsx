const resolveConfig = require('tailwindcss/resolveConfig');
const tailwindConfig = require('../../tailwind.config');
const { theme } = resolveConfig(tailwindConfig);

interface Props {
  size: number;
}

const Spinner: React.FunctionComponent<Props> = ({ size }: Props) => {
  if (!size) {
    size = 30;
  }

  return (
    <div
      style={{
        height: `${size}px`,
        width: `${size}px`,
        borderTopColor: theme.colors['white'],
      }}
      className={`ease-linear border-blue1 border-4 border-t-4 rounded-full spinner loader`}
    ></div>
  );
};

export default Spinner;
