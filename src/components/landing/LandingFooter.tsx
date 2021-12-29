import Link from '../ui/Link';
import Logo from '../ui/Logo';
import Container from './Container';

const LandingFooter: React.FunctionComponent = () => {
  return (
    <footer className="py-12 text-white bg-dark">
      <Container>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Logo />
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/terms" className="hover:text-gray">
              Terms of Use
            </Link>
            <Link href="/privacy-policy" className="hover:text-gray">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-gray">
              Contact
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default LandingFooter;
