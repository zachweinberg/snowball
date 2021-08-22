import classNames from 'classnames';

interface Props {
  active: string;
  options: Array<{ label: string; onClick: () => void }>;
}

const Tabs: React.FunctionComponent<Props> = ({ options, active }: Props) => {
  return (
    <div className="flex space-x-6 font-medium sm:flex-row sm:flex-wrap">
      {options.map((option) => (
        <div
          key={option.label}
          className={classNames(
            'flex items-center font-semibold cursor-pointer',
            active === option.label ? 'text-blue1' : 'text-purple2 hover:text-blue1'
          )}
          onClick={option.onClick}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
