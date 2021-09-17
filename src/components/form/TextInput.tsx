import classNames from 'classnames';

type Props = {
  type: 'text' | 'password' | 'email' | 'number';
  label?: string;
  name: string;
  placeholder: string;
  className?: string;
};

const TextInput: React.FunctionComponent<Props> = ({
  label,
  className,
  name,
  type,
  placeholder,
}: Props) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className={classNames(
        'p-3 border-2 rounded-xl border-gray placeholder-darkgray w-full focus:outline-none focus:ring-evergreen focus:border-evergreen',
        className
      )}
    />
  );
};

export default TextInput;
