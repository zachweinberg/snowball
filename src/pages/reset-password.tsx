import classNames from 'classnames';
import type { NextPage } from 'next';
import React, { useState } from 'react';
import * as yup from 'yup';
import RequiredLoggedOut from '~/components/auth/RequireLoggedOut';
import Button from '~/components/ui/Button';
import Cloud from '~/components/ui/Cloud';
import Link from '~/components/ui/Link';
import TextInput from '~/components/ui/TextInput';
import { useAuth } from '~/hooks/useAuth';

const passwordResetSchema = yup.object().shape({
  email: yup.string().email('Must be an email.').required('Email is required.'),
});

const PasswordResetPage: NextPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  const onSubmit = async (e) => {
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
    <RequiredLoggedOut>
      <form
        onSubmit={onSubmit}
        className={classNames(
          'max-w-lg border border-bordergray p-8 mx-auto mt-20 bg-white shadow-md rounded-2xl',
          {
            'bg-opacity-70': loading,
          }
        )}
      >
        <div className="flex justify-between mb-20">
          <Cloud />
          <div className="flex font-semibold text-[1rem]">
            <p className="text-darkgray">Back to</p>
            <Link href="/login">
              <span className="ml-1 underline text-evergreen hover:opacity-80">Login</span>
            </Link>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-dark font-bold text-[1.75rem] leading-tight mb-3">
            Forget your password?
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
          <p className="mb-5 font-semibold text-evergreen">
            We've sent you an email with password reset instructions!
          </p>
        )}

        {error && <p className="mb-10 text-red">{error}</p>}

        <div className="mb-16">
          <Button type="submit" disabled={loading}>
            Send password reset email
          </Button>
        </div>
      </form>
    </RequiredLoggedOut>
  );
};

export default PasswordResetPage;
