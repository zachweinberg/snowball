import classNames from 'classnames';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface Props {
  name: string;
  value: string;
  placeholder: string;
  onChange: (e) => void;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

const PhoneInputFC: React.FunctionComponent<Props> = ({
  placeholder,
  onChange,
  disabled,
  required,
  value,
  name,
  className,
}: Props) => {
  return (
    <PhoneInput
      inputProps={{
        name,
        required,
        autoComplete: 'off',
        className: classNames(
          'p-3 border-2 rounded-md border-gray placeholder-darkgray w-full focus:outline-none focus:ring-evergreen focus:border-evergreen',
          className
        ),
      }}
      buttonClass="hidden"
      country={'us'}
      onlyCountries={['us']}
      autoFormat
      disableSearchIcon
      disabled={disabled}
      disableCountryCode
      disableDropdown
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default PhoneInputFC;
