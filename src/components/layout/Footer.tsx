import Link from '../ui/Link';

const Footer: React.FunctionComponent = () => {
  return (
    <footer className="flex-shrink-0 bg-white border-t border-gray">
      <div className="flex justify-between px-4 py-6 mx-auto max-w-7xl">
        <p className="text-xs">Terms</p>
        <div className="flex">
          <p className="mr-2">Have feedback?</p>
          <Link href="/contact">
            <p className="font-semibold underline text-evergreen">Contact Us</p>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
