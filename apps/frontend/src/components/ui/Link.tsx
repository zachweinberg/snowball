import NextLink from 'next/link';

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
}
const Link: React.FunctionComponent<Props> = ({ href, children, className }: Props) => {
  return (
    <NextLink href={href}>
      <a className={className}>{children}</a>
    </NextLink>
  );
};

export default Link;
