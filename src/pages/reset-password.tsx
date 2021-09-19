import classNames from 'classnames';
import type { NextPage } from 'next';
import React, { useState } from 'react';
import * as yup from 'yup';
import RequiredLoggedOut from '~/components/auth/RequireLoggedOut';
import Button from '~/components/ui/Button';
import Cloud from '~/components/ui/Cloud';
import Link from '~/components/ui/Link';
import TextInput from '~/components/ui/TextInput';
import Typography from '~/components/ui/Typography';
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
        // Ignore
      }

      setSuccess(true);
      setError('');
      setLoading(false);
    }
  };

  return (
    <RequiredLoggedOut>
      <form
        className={classNames('max-w-lg p-8 mx-auto mt-20 bg-white shadow-md rounded-2xl', {
          'opacity-70': loading,
        })}
        onSubmit={onSubmit}
      >
        <div className="flex justify-between mb-20">
          <Cloud />
        </div>

        <div className="mb-10">
          <Typography element="h1" variant="Headline1" className="mb-3 text-dark">
            Having some trouble?
          </Typography>
          <Typography element="p" variant="Paragraph">
            To reset your password, please provide the email address you used to register your
            account.
          </Typography>
        </div>

        <div className="mb-10">
          <TextInput
            required
            name="email"
            placeholder="Email"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {error && <p className="mb-10 text-red">{error}</p>}

        {success && (
          <p className="mb-10 text-evergreen">
            We've sent you an email with password reset instructions!
          </p>
        )}

        <div className="mb-16">
          <Button type="submit" disabled={loading} className="mb-4">
            Send password reset email
          </Button>
          <div className="flex justify-center">
            <Link href="/login">
              <Typography element="div" variant="Link" className="underline text-evergreen">
                Login
              </Typography>
            </Link>
          </div>
        </div>
      </form>
    </RequiredLoggedOut>
  );
};

export default PasswordResetPage;
