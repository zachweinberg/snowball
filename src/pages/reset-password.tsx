import classNames from 'classnames';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import Layout from '~/components/layout/Layout';
import Button from '~/components/ui/Button';
import Link from '~/components/ui/Link';
import Spinner from '~/components/ui/Spinner';
import TextInput from '~/components/ui/TextInput';
import { useAuth } from '~/hooks/useAuth';
import firebase from '~/lib/firebase';

const passwordResetSchema = yup.object().shape({
  email: yup.string().email('Must be an email.').required('Email is required.'),
});

const TriggerResetPasswordEmail: React.FunctionComponent = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const auth = useAuth();

  const onSubmitEmail = async (e) => {
    e.preventDefault();

    let isValid = false;

    try {
      await passwordResetSchema.validate({
        email,
      });
      isValid = true;
    } catch (err) {
      setSuccess(false);
      setError(err.errors?.[0] ?? '');
    }

    if (isValid) {
      setLoading(true);
      try {
        await auth.sendPasswordResetEmail(email);
      } catch (err) {
        // Ignore, no problem
      }

      setSuccess(true);
      setError('');
      setEmail('');
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitEmail}
      className={classNames(
        'max-w-lg border relative border-bordergray p-8 mx-auto mt-20 bg-white shadow-md rounded-2xl',
        {
          'bg-opacity-50': loading,
        }
      )}
    >
      {loading && (
        <div className="absolute inset-0 flex justify-center mt-52">
          <Spinner size={38} />
        </div>
      )}

      <div className="flex justify-between mb-20">
        <div className="flex font-semibold text-[1rem] items-center">
          <Link href="/login">
            <span className="ml-1 underline text-evergreen hover:opacity-80">Back</span>
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-dark font-bold text-[1.75rem] leading-tight mb-3">
          Forgot your password?
        </h1>
        <p className="font-medium text-[1.1rem] text-darkgray leading-tight">
          Enter your email below and we will send you an email to reset your password.
        </p>
      </div>

      <div className="mb-5">
        <TextInput
          name="email"
          value={email}
          placeholder="Email address"
          type="email"
          required
          className="mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {success && (
        <p className="mb-5 font-medium leading-5 text-evergreen">
          We've sent you an email with password reset instructions!
        </p>
      )}

      {error && <p className="mb-5 leading-5 text-left text-red">{error}</p>}

      <div className="mb-16">
        <Button type="submit" disabled={loading}>
          Send password reset email
        </Button>
      </div>
    </form>
  );
};

const EnterNewPassword: React.FunctionComponent = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validPageLoad, setValidPageLoad] = useState(false);
  const router = useRouter();

  const checkAndResetPassword = async (e) => {
    e.preventDefault();

    const code = router.query.oobCode as string;

    if (!code) {
      setError('Something went wrong.');
      return;
    }

    try {
      await firebase.auth().verifyPasswordResetCode(code);
    } catch (err) {
      setError('Something went wrong.');
      return;
    }

    try {
      await firebase.auth().confirmPasswordReset(code, newPassword);
      setSuccess(true);
    } catch (err) {
      setError('Something went wrong.');
    }
  };

  useEffect(() => {
    if (router.query && router.query.mode && router.query.mode !== 'resetPassword') {
      router.push('/');
    }

    firebase
      .auth()
      .verifyPasswordResetCode(router.query.oobCode as string)
      .then(() => setValidPageLoad(true))
      .catch((err) => router.push('/'));
  }, []);

  return !validPageLoad ? null : (
    <form
      onSubmit={checkAndResetPassword}
      className={classNames(
        'relative max-w-lg border border-bordergray p-8 mx-auto mt-20 bg-white shadow-md rounded-2xl',
        {
          'bg-opacity-50': loading,
        }
      )}
    >
      {loading && (
        <div className="absolute inset-0 flex justify-center mt-52">
          <Spinner size={38} />
        </div>
      )}

      <div className="flex justify-between mb-20">
        <div className="flex font-semibold text-[1rem] items-center">
          <Link href="/login">
            <span className="ml-1 underline text-evergreen hover:opacity-80">Back</span>
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-dark font-bold text-[1.75rem] leading-tight mb-3">
          Reset password
        </h1>
        <p className="font-medium text-[1.1rem] text-darkgray leading-tight">
          Enter your new password below
        </p>
      </div>

      <div className="mb-2">
        <TextInput
          name="password"
          value={newPassword}
          placeholder="New password"
          type="password"
          required
          className="mb-4"
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div className="mb-5">
        <TextInput
          name="newPassword"
          value={confirmNewPassword}
          placeholder="Confirm new password"
          type="password"
          required
          className="mb-4"
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
      </div>

      {success && (
        <p className="mb-5 font-medium leading-5 text-evergreen">
          Password changed! <Link href="/login">Go back</Link>
        </p>
      )}

      {error && <p className="mb-5 leading-5 text-left text-red">{error}</p>}

      <div className="mb-16">
        <Button type="submit" disabled={loading}>
          Change password
        </Button>
      </div>
    </form>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (ctx.query && ctx.query.mode && ctx.query.mode !== 'resetPassword') {
    return {
      props: {},
      redirect: { destination: '/' },
    };
  }

  return { props: {} };
};

const PasswordResetPage: NextPage = () => {
  const router = useRouter();

  return (
    <Layout title="Reset Password | Obsidian Tracker">
      {router.query && router.query.mode === 'resetPassword' ? (
        <EnterNewPassword />
      ) : (
        <TriggerResetPasswordEmail />
      )}
    </Layout>
  );
};

export default PasswordResetPage;
