import Logo from '../ui/Logo';
import Container from './Container';

const LandingFooter: React.FunctionComponent = () => {
  return (
    <footer className="py-12 text-white bg-dark">
      <Container>
        <Logo width={120} />

        <div>
          <a>Privacy Policy</a>
        </div>
      </Container>
    </footer>
  );
};

export default LandingFooter;
