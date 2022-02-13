import classNames from 'classnames';

interface H2Props {
  children: React.ReactNode;
  dark?: boolean;
}

const H2: React.FunctionComponent<H2Props> = ({ children, dark }: H2Props) => {
  return (
    <h2
      className={classNames(
        'text-3xl font-medium leading-tight lg:text-[1.95rem]',
        dark ? 'text-white' : 'text-dark'
      )}
    >
      {children}
    </h2>
  );
};

export default H2;
