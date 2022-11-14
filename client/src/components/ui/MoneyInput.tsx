import classNames from 'classnames';
import ReactNumeric, { predefinedOptions } from 'react-numeric';

interface Props {
  name: string;
  value: number | null;
  placeholder: string;
  onChange: (e) => void;
  className?: string;
  backgroundColor?: string;
  required?: boolean;
  disabled?: boolean;
  numDecimals?: number;
}

const MoneyInput: React.FunctionComponent<Props> = ({
  placeholder,
  onChange,
  disabled,
  required,
  value,
  numDecimals,
  backgroundColor,
  name,
  className,
}: Props) => {
  return (
    <ReactNumeric
      className={classNames(
        'p-3 border-2 rounded-md bg-light border-gray placeholder-darkgray w-full focus:outline-none focus:ring-evergreen focus:border-evergreen disabled:opacity-50',
        className
      )}
      name={name}
      required={required}
      value={value}
      preDefined={predefinedOptions.dollarPos}
      minimumValue="0"
      placeholder={placeholder}
      style={{ backgroundColor }}
      showWarnings={false}
      disabled={disabled}
      decimalPlaces={numDecimals ?? 2}
      allowDecimalPadding
      onChange={(event, value) => {
        onChange(value);
      }}
    />
  );
};

export default MoneyInput;
