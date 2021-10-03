import classNames from 'classnames';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { formatMoneyFromNumber } from '~/lib/money';

interface Props {
  name: string;
  value: number | null;
  placeholder: string;
  onChange: (e) => void;
  className?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

const MoneyInput: React.FunctionComponent<Props> = ({
  label,
  placeholder,
  onChange,
  disabled,
  required,
  value,
  name,
  className,
}: Props) => {
  const currencyMask = createNumberMask({
    prefix: '$',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ',',
    allowDecimal: true,
    decimalSymbol: '.',
    decimalLimit: 8,
    integerLimit: 9,
    allowNegative: false,
    allowLeadingZeroes: false,
  });

  return (
    <MaskedInput
      mask={currencyMask}
      name={name}
      disabled={disabled}
      required={required}
      value={value === null ? '' : formatMoneyFromNumber(value ?? 0)}
      onChange={(e) => {
        const val: string = e.target.value;

        if (val === '') {
          onChange(0);
          return;
        }
        onChange(parseInt(val.replace(/\$\,/g, '') ?? 0));
      }}
      placeholder={placeholder}
      className={classNames(
        'p-3 border-2 rounded-xl bg-light border-gray placeholder-darkgray w-full focus:outline-none focus:ring-evergreen focus:border-evergreen',
        className
      )}
    />
  );
};

export default MoneyInput;
