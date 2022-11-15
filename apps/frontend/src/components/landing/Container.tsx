interface Props {
  children: React.ReactNode;
}

const Container: React.FunctionComponent<Props> = ({ children }: Props) => {
  return <div className="max-w-6xl px-5 mx-auto">{children}</div>;
};

export default Container;
