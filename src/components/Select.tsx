import classNames from 'classnames';
import { UseFormRegister } from 'react-hook-form';

type Props = {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  options: any[];
  error?: string;
  required?: boolean;
  className?: string;
};

const Select: React.FunctionComponent<Props> = ({
  label,
  name,
  className,
  required,
  error,
  options,
  register,
}: Props) => {
  const optionalRegisterProps = {
    ...(register && { ...register(name, { required: required ? true : false }) }),
  };

  return (
    <div>
      {label && (
        <p className="mb-2 text-sm font-bold tracking-widest uppercase text-purple1">
          {label}
        </p>
      )}
      <select
        defaultValue={label}
        className={classNames(
          'px-3 py-2 rounded-lg border border-purple1 w-full bg-gray2 placeholder-purple1 text-gray10 focus:outline-none focus:ring-purple2 focus:border-purple1',
          className
        )}
        {...optionalRegisterProps}
      >
        <option disabled value={label}>
          {label}
        </option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red3">{error}</p>}
    </div>
  );
};

export default Select;
