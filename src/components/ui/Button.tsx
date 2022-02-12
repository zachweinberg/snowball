import classNames from 'classnames';
import { ReactNode } from 'react';

interface Props {
  type: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  secondary?: boolean;
  variant?: 'primary' | 'secondary' | 'white' | 'danger' | 'upgrade';
  children: ReactNode;
}

const Button: React.FunctionComponent<Props> = ({
  children,
  disabled,
  className,
  type,
  onClick,
  variant = 'primary',
}: Props) => {
  return (
    <button
      type={type}
      className={classNames(
        'w-full rounded-xl p-5 font-semibold transition-colors',
        { 'opacity-70 cursor-not-allowed': disabled },
        { 'hover:opacity-90': !disabled },
        variant === 'secondary'
          ? 'bg-background text-dark border-2 border-dark'
          : variant === 'danger'
          ? 'bg-red text-white'
          : variant === 'white'
          ? 'bg-white text-dark hover:bg-lime'
          : variant === 'upgrade'
          ? 'bg-gradient-to-r from-evergreen to-lightlime text-dark border-dark border-2'
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
