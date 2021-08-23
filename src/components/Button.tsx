import classNames from 'classnames';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  small?: boolean;
  type: 'button' | 'submit';
  className?: string;
}

const Button: React.FunctionComponent<Props> = ({
  children,
  disabled,
  small,
  className,
  onClick,
  type,
}: Props) => {
  return (
    <button
      type={type}
      className={classNames(
        'disabled:cursor-not-allowed bg-blue1 hover:bg-blue2 disabled:opacity-60 inline-flex items-center transition-colors justify-center font-medium text-white border border-transparent rounded-md shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue2',
        small ? 'py-1 px-2' : 'px-10 py-3',
        className
      )}
      disabled={disabled}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      {children}
    </button>
  );
};

export default Button;
