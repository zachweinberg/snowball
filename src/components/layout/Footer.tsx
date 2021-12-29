import Link from '../ui/Link';

const Footer: React.FunctionComponent = () => {
  return (
    <footer className="flex-shrink-0 text-xs bg-white border-t border-gray">
      <div className="flex items-center justify-between px-4 py-6 mx-auto max-w-7xl">
        <div className="flex items-center space-x-3">
          <p>&copy; {new Date().getFullYear()} Obsidian Tracker</p>
          <Link href="/terms" className="hover:text-evergreen">
            Terms Of Use
          </Link>
          <Link href="/privacy-policy" className="hover:text-evergreen">
            Privacy Policy
          </Link>
        </div>

        <div className="flex items-center">
          <p className="mr-2">Have feedback?</p>
          <Link
            href="/contact"
            className="font-semibold underline text-evergreen hover:opacity-70"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
