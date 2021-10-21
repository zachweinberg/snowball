import classNames from 'classnames';

type Props = {
  type: 'text' | 'password' | 'email' | 'number';
  label?: string;
  name: string;
  value: string | number | null;
  placeholder: string;
  required?: boolean;
  backgroundColor?: string;
  secondary?: boolean;
  className?: string;
  paddingX?: number;
  onChange: (e) => void;
};

const TextInput: React.FunctionComponent<Props> = ({
  className,
  name,
  type,
  onChange,
  placeholder,
  value,
  backgroundColor,
  required,
}: Props) => {
  return (
    <input
      type={type}
      value={value !== null ? value : undefined}
      onChange={onChange}
      name={name}
      placeholder={placeholder}
      required={required}
      style={{ backgroundColor }}
      className={classNames(
        'p-3 border-2 rounded-xl border-gray placeholder-darkgray w-full focus:outline-none focus:ring-evergreen focus:border-evergreen',
        className
      )}
    />
  );
};

export default TextInput;
