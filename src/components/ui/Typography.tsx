import classNames from 'classnames';

type VariantKeys =
  | 'Headline1'
  | 'Headline2'
  | 'Headline3'
  | 'Headline4'
  | 'Numbers'
  | 'Paragraph'
  | 'Navigation'
  | 'Button'
  | 'Label'
  | 'Table'
  | 'TableSmall'
  | 'Link';

interface Props {
  variant: VariantKeys;
  element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p' | 'div';
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

const styles: Record<VariantKeys, string> = {
  Headline1: 'font-poppins font-bold text-[2rem] leading-tight',
  Headline2: 'font-poppins font-bold text-[1.31rem]',
  Headline3: 'font-poppins font-semibold text-[1.1rem] leading-tight',
  Headline4: 'font-poppins font-semibold text-[0.9rem] leading-tight',
  Numbers: 'font-poppins font-semibold text-[1.75rem]',
  Paragraph: 'font-poppins font-medium text-[1rem] gray leading-tight',
  Navigation: 'font-poppins font-semibold text-[0.9rem]',
  Button: 'font-poppins font-semibold text-[1rem]',
  Label: 'font-poppins font-semibold text-[0.9rem]',
  Table: 'font-poppins font-bold text-[0.94rem]',
  TableSmall: 'font-poppins font-bold text-[0.8rem]',
  Link: 'font-poppins font-semibold text-[1rem] cursor-pointer hover:opacity-70',
};

const Typography: React.FunctionComponent<Props> = ({
  variant,
  element,
  children,
  className,
  ...rest
}: Props) => {
  const Element = element;
  return (
    <Element className={classNames(styles[variant], className)} {...rest}>
      {children}
    </Element>
  );
};

export default Typography;
