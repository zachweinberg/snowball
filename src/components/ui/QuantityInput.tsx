import classNames from 'classnames';
import ReactNumeric from 'react-numeric';

interface Props {
  name: string;
  value: number | null;
  placeholder: string;
  onChange: (e) => void;
  className?: string;
  required?: boolean;
  numDecimals?: number;
  disabled?: boolean;
  backgroundColor?: string;
}

const QuantityInput: React.FunctionComponent<Props> = ({
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
        'p-3 border-2 rounded-xl bg-light border-gray placeholder-darkgray w-full focus:outline-none focus:ring-evergreen focus:border-evergreen',
        className
      )}
      name={name}
      required={required}
      decimalCharacter="."
      decimalPlaces={numDecimals ?? 2}
      minimumValue="0"
      style={{ backgroundColor }}
      showWarnings={false}
      value={value}
      placeholder={placeholder}
      allowDecimalPadding={false}
      disabled={disabled}
      onChange={(event, value) => {
        onChange(value);
      }}
    />
  );
};

export default QuantityInput;
