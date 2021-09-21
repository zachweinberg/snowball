import classNames from 'classnames';

type Props = {
  label?: string;
  name: string;
  value: string;
  placeholder: string;
  required?: boolean;
  className?: string;
  onChange: (e) => void;
};

const TextArea: React.FunctionComponent<Props> = ({
  label,
  className,
  name,

  onChange,
  placeholder,
  value,
  required,
}: Props) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      name={name}
      placeholder={placeholder}
      required={required}
      className={classNames(
        'p-3 border-2 rounded-xl bg-light border-gray placeholder-darkgray w-full focus:outline-none focus:ring-evergreen focus:border-evergreen',
        className
      )}
    ></textarea>
  );
};

export default TextArea;
