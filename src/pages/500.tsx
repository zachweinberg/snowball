import { QuestionMarkCircleIcon } from '@heroicons/react/solid';
import Button from '~/components/ui/Button';
import Link from '~/components/ui/Link';

const ServerErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-sm mx-auto mt-40">
      <div className="flex flex-col items-center">
        <QuestionMarkCircleIcon className="mb-4 w-14 h-14" />
        <p className="mb-6 text-xl">
          Something went wrong behind the scenes while loading this page. Please contact us if
          this persists.
        </p>
      </div>
      <Link href="/">
        <Button type="button" variant="secondary" className="w-36">
          Home
        </Button>
      </Link>
    </div>
  );
};

export default ServerErrorPage;
