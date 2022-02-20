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
  let classes = 'w-full rounded-md font-semibold p-5 transition-colors ';

  switch (variant) {
    case 'primary':
      classes += 'bg-dark text-white ';
      classes += disabled
        ? 'cursor-not-allowed opacity-50 '
        : 'cursor-pointer hover:opacity-90 ';
      break;
    case 'secondary':
      classes += 'bg-background text-dark border-2 border-dark ';
      classes += disabled
        ? 'cursor-not-allowed opacity-50 '
        : 'cursor-pointer hover:opacity-90 hover:bg-dark hover:text-white ';
      break;
    case 'danger':
      classes += 'bg-red text-white ';
      classes += disabled
        ? 'cursor-not-allowed opacity-50 '
        : 'cursor-pointer hover:opacity-90 ';
      break;
    case 'white':
      classes += 'bg-white text-dark hover:bg-lime ';
      classes += disabled
        ? 'cursor-not-allowed opacity-50 '
        : 'cursor-pointer hover:opacity-90 ';
      break;
    case 'upgrade':
      classes += 'bg-gradient-to-r from-evergreen to-lightlime text-dark shadow-md ';
      classes += disabled
        ? 'cursor-not-allowed opacity-50 '
        : 'cursor-pointer hover:opacity-90 ';
      break;
  }

  return (
    <button
      type={type}
      className={classNames(classes, className)}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
