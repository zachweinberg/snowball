import classNames from 'classnames';
import { ReactNode } from 'react';

interface Props {
  type: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}

const Button: React.FunctionComponent<Props> = ({
  children,
  disabled,
  className,
  type,
  onClick,
}: Props) => {
  return (
    <button
      type={type}
      className={classNames(
        'w-full rounded-xl bg-dark text-white p-5 font-semibold hover:bg-opacity-80 transition-colors',
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
