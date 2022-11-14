import H2 from '~/components/landing/H2';
import Container from './Container';

interface FeatureSectionProps {
  heading: string;
  subtitle: string;
  imgURL?: string;
}

const FeatureSection: React.FunctionComponent<FeatureSectionProps> = ({
  heading,
  subtitle,
  imgURL,
}: FeatureSectionProps) => {
  return (
    <div className="py-12 text-center text-white bg-dark">
      <Container>
        <div>
          <H2 dark>{heading}</H2>
          <p className="leading-6 my-7 text-md md:text-lg">{subtitle}</p>
        </div>

        {imgURL && <img src={imgURL} className="w-full shadow-lg md:block rounded-md" />}
      </Container>
    </div>
  );
};

export default FeatureSection;
