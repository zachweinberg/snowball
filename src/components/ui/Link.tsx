import NextLink from 'next/link';

interface Props {
  href: string;
  children: React.ReactNode;
}
const Link: React.FunctionComponent<Props> = ({ href, children }: Props) => {
  return (
    <NextLink href={href}>
      <a>{children}</a>
    </NextLink>
  );
};

export default Link;
