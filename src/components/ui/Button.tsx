import classNames from 'classnames';
import { ReactNode } from 'react';

interface Props {
  type: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  secondary?: boolean;
  variant?: 'primary' | 'secondary' | 'white' | 'danger';
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
        'w-full rounded-xl p-5 font-semibold hover:opacity-90 transition-colors ',
        { 'opacity-70 cursor-not-allowed': disabled },
        variant === 'secondary'
          ? 'bg-background text-dark border-2 border-dark hover:bg-black hover:text-white'
          : variant === 'danger'
          ? 'bg-red text-white'
          : variant === 'white'
          ? 'bg-white text-dark hover:bg-lime'
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
