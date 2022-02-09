import Link from '../ui/Link';

interface Props {
  type: string;
}
const UpgradeBanner: React.FunctionComponent<Props> = ({ type }) => {
  return (
    <div className="p-4 rounded-md text-dark mb-7 bg-lightlime">
      To add more {type}, please{' '}
      <Link href="/upgrade" className="underline text-evergreen hover:opacity-70">
        upgrade to the premium plan
      </Link>
    </div>
  );
};

export default UpgradeBanner;
