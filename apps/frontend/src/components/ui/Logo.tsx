interface Props {
  dark?: boolean;
}

const Logo: React.FunctionComponent<Props> = ({ dark }: Props) => {
  return <p style={{ fontSize: '2rem', fontWeight: 600 }}>Snowball</p>;
};

export default Logo;
