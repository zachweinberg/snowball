import classNames from 'classnames';

type Props = {
  type: 'text' | 'password' | 'email' | 'number';
  label?: string;
  name: string;
  placeholder: string;
  required?: boolean;
  className?: string;
  onChange: (e) => void;
};

const TextInput: React.FunctionComponent<Props> = ({
  label,
  className,
  name,
  type,
  onChange,
  placeholder,
  required,
}: Props) => {
  return (
    <input
      type={type}
      onChange={onChange}
      name={name}
      placeholder={placeholder}
      required={required}
      className={classNames(
        'p-3 border-2 rounded-xl border-gray placeholder-darkgray w-full focus:outline-none focus:ring-evergreen focus:border-evergreen',
        className
      )}
    />
  );
};

export default TextInput;
