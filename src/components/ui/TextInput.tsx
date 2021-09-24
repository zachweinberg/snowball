import classNames from 'classnames';

type Props = {
  type: 'text' | 'password' | 'email' | 'number';
  label?: string;
  name: string;
  value: string | number | null;
  placeholder: string;
  required?: boolean;
  secondary?: boolean;
  className?: string;
  onChange: (e) => void;
};

const TextInput: React.FunctionComponent<Props> = ({
  label,
  className,
  name,
  secondary = false,
  type,
  onChange,
  placeholder,
  value,
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
      className={classNames(
        'p-3 border-2 rounded-xl border-gray placeholder-darkgray w-full focus:outline-none focus:ring-evergreen focus:border-evergreen',
        className,
        secondary ? 'bg-white' : 'bg-light'
      )}
    />
  );
};

export default TextInput;
