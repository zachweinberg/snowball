import cs from 'classnames';

interface Props {
  name: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

const Checkbox: React.FunctionComponent<Props> = ({
  name,
  title,
  description,
  checked,
  className,
  onChange,
}: Props) => {
  return (
    <div className={cs('relative flex items-start', className)}>
      <div className="flex items-center h-5">
        <input
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          name={name}
          type="checkbox"
          className="w-5 h-5 rounded cursor-pointer text-evergreen border-darkgray focus:ring-evergreen"
        />
      </div>
      <div className="ml-3">
        <label htmlFor={name} className="font-medium text-dark">
          {title}
        </label>
        <p className="mt-1 text-sm font-medium text-darkgray">{description}</p>
      </div>
    </div>
  );
};

export default Checkbox;
