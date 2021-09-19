import classNames from 'classnames';
import CurrencyInput from 'react-currency-input-field';

type Props = {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  className?: string;
  disabled?: boolean;
};

const MoneyInput: React.FunctionComponent<Props> = ({
  label,
  placeholder,
  disabled,
  value,
  name,
  className,
}: Props) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-sm font-bold tracking-widest uppercase text-purple1"
        >
          {label}
        </label>
      )}

      <CurrencyInput
        className={classNames(
          'px-3 py-2 rounded-lg border border-purple1 w-full bg-gray2 placeholder-purple1 text-gray10 focus:outline-none focus:ring-blue1 focus:border-blue1 disabled:opacity-70 disabled:text-purple2',
          className
        )}
        name={name}
        placeholder={placeholder}
        defaultValue={1000}
        prefix="$"
        disabled={disabled}
        autoComplete="off"
        decimalsLimit={2}
        allowNegativeValue={false}
        step={1}
        value={value}
        onValueChange={(value) => {
          //
        }}
      />
    </div>
  );
};

export default MoneyInput;
