interface Props {
  width?: number;
  className?: string;
}

const Cloud: React.FunctionComponent<Props> = ({ width, className }: Props) => (
  <div className="flex items-center">
    <span>Obsidian</span>
  </div>
);

export default Cloud;
