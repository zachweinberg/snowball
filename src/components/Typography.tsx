type VariantKeys =
  | 'Headline1'
  | 'Headline2'
  | 'Headline3'
  | 'Numbers'
  | 'Paragraph'
  | 'Navigation'
  | 'Button'
  | 'Label'
  | 'Table'
  | 'TableSmall';

interface Props {
  variant: VariantKeys;
  element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p' | 'div' | 'a';
  children: React.ReactNode;
}

const Typography: React.FunctionComponent<Props> = ({ variant, element, children }: Props) => {
  const styles: Record<VariantKeys, string> = {
    Headline1: 'font-poppins font-bold text-4xl',
    Headline2: 'font-poppins font-bold text-22',
    Headline3: 'font-poppins font-semibold text-18',
    Numbers: 'font-poppins font-semibold text-28',
    Paragraph: 'font-poppins font-medium text-16',
    Navigation: 'font-poppins font-semibold text-14',
    Button: 'font-poppins font-semibold text-16',
    Label: 'font-poppins font-semibold text-14',
    Table: 'font-poppins font-bold text-15',
    TableSmall: 'font-poppins font-bold text-13',
  };

  const Element = element;
  return <Element className={styles[variant]}>{children}</Element>;
};

export default Typography;
