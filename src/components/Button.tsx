import classNames from 'classnames';
import { ReactNode } from 'react';

interface Props {
  type: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  secondary?: boolean;
  children: ReactNode;
}

const Button: React.FunctionComponent<Props> = ({
  children,
  disabled,
  className,
  type,
  secondary,
  onClick,
}: Props) => {
  return (
    <button
      type={type}
      className={classNames(
        'w-full rounded-xl p-5 font-semibold hover:bg-opacity-80 transition-colors',
        { 'opacity-70': disabled },
        secondary
          ? 'bg-background text-dark border-2 border-dark hover:bg-dark hover:text-white'
          : 'bg-dark text-white',
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
