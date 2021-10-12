import { CheckIcon } from '@heroicons/react/outline';
import type { GetServerSideProps } from 'next';
import Button from '~/components/ui/Button';
import Link from '~/components/ui/Link';
import { API } from '~/lib/api';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const query = ctx.query as { t: string; u: string };

  // Token and user id
  const { t, u } = query;

  if (!t || !u) {
    return { redirect: { destination: '/portfolios' }, props: { verified: false } };
  }

  try {
    const response = await API.checkVerificationToken(t, u);

    if (!response.verified) {
      return { redirect: { destination: '/portfolios' }, props: { verified: false } };
    }

    return { props: { verified: true } };
  } catch (err) {
    return { redirect: { destination: '/portfolios' }, props: { verified: false } };
  }
};

const VerifyAccount = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-sm mx-auto mt-32">
      <div className="flex flex-col items-center">
        <CheckIcon className="w-32 h-32" />
        <p className="mb-6 text-xl">Thanks! Your account is now verified.</p>
      </div>
      <Link href="/portfolios">
        <Button type="button" variant="secondary">
          Continue
        </Button>
      </Link>
    </div>
  );
};

export default VerifyAccount;
