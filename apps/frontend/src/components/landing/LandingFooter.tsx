import Link from '../ui/Link';
import Logo from '../ui/Logo';
import Container from './Container';

const LandingFooter: React.FunctionComponent = () => {
  return (
    <footer className="py-12 text-white bg-dark">
      <Container>
        <div className="flex flex-col items-start justify-between space-y-2 text-sm md:flex-row">
          <div className="flex items-center">
            <div className="flex flex-col space-y-2">
              <Logo />
            </div>
          </div>
          <div className="flex items-center space-x-5">
            <a href="/terms-of-use" className="hover:text-gray">
              Terms of Use
            </a>
            <a href="/privacy-policy" className="hover:text-gray">
              Privacy Policy
            </a>
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
