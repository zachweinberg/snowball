import classNames from 'classnames';

type Props = {
  type: 'text' | 'password' | 'email';
  label: string;
  name: string;
  placeholder: string;
  error?: string;
  className?: string;
};

const TextInput: React.FunctionComponent<Props> = ({
  label,
  type,
  name,
  placeholder,
  className,
  error,
}: Props) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="mb-2 text-sm font-bold tracking-widest uppercase text-purple1"
        >
          {label}
        </label>
      )}

      <input
        className={classNames(
          'px-3 py-2 rounded-lg border border-purple1 w-full bg-gray2 placeholder-purple1 text-gray10 focus:outline-none focus:ring-purple2 focus:border-purple1',
          className
        )}
        name={name}
        placeholder={placeholder}
        type={type}
      />

      {error && <p className="mt-1 text-sm text-red3">{error}</p>}
    </div>
  );
};

export default TextInput;
