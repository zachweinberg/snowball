import classNames from 'classnames';
import { useEffect, useRef } from 'react';

type Props = {
  type: 'text' | 'password' | 'email' | 'number';
  label?: string;
  name: string;
  value: string | number | null;
  placeholder: string;
  required?: boolean;
  backgroundColor?: string;
  secondary?: boolean;
  className?: string;
  paddingX?: number;
  onChange: (e) => void;
  autofocus?: boolean;
};

const TextInput: React.FunctionComponent<Props> = ({
  className,
  name,
  type,
  onChange,
  placeholder,
  value,
  backgroundColor,
  required,
  autofocus = false,
}: Props) => {
  const inputElement = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputElement.current && autofocus) {
      inputElement.current.focus();
    }
  }, [inputElement.current]);

  return (
    <input
      ref={inputElement}
      type={type}
      value={value !== null ? value : undefined}
      onChange={onChange}
      name={name}
      placeholder={placeholder}
      spellCheck={false}
      autoComplete="off"
      required={required}
      style={{ backgroundColor }}
      className={classNames(
        'p-3 border-2 rounded-md border-bordergray placeholder-darkgray w-full focus:outline-none focus:ring-evergreen focus:border-evergreen',
        className
      )}
    />
  );
};

export default TextInput;
