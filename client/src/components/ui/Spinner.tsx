const resolveConfig = require('tailwindcss/resolveConfig');
const tailwindConfig = require('../../../tailwind.config');
const { theme } = resolveConfig(tailwindConfig);

interface Props {
  size?: number;
  color?: string;
}

const Spinner: React.FunctionComponent<Props> = ({ size = 40, color }: Props) => {
  if (!color) {
    color = theme.colors['white'];
  }

  return (
    <div
      style={{
        height: `${size}px`,
        width: `${size}px`,
        borderTopColor: color,
      }}
      className={`ease-linear border-4 border-t-4 rounded-full spinner loader`}
    ></div>
  );
};

export default Spinner;
