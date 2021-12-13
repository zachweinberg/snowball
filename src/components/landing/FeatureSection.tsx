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
    <div className="py-12 text-center text-white border-b bg-dark">
      <Container>
        <div>
          <H2 dark>{heading}</H2>
          <p className="leading-6 my-7 text-md md:text-lg">{subtitle}</p>
        </div>

        {imgURL && (
          <img
            src={imgURL}
            className="w-full border-2 shadow-lg md:block border-gray rounded-xl"
          />
        )}
      </Container>
    </div>
  );
};

export default FeatureSection;
