import classNames from 'classnames';
import { trackGoal } from 'fathom-client';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { PlanType } from 'schema';
import RequiredLoggedIn from '~/components/auth/RequireLoggedIn';
import Layout from '~/components/layout/Layout';
import ConfirmModal from '~/components/modals/ConfirmModal';
import TextInput from '~/components/ui/TextInput';
import { useAuth } from '~/hooks/useAuth';
import { useConfirm } from '~/hooks/useConfirm';
import { API } from '~/lib/api';

const Btn = (props) => {
  return (
    <button
      type="submit"
      className={classNames(
        'px-4 py-3 font-semibold text-white transition-colors duration-150 rounded-md hover:bg-opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-evergreen focus:outline-none',
        props.red ? 'bg-red' : 'bg-evergreen'
      )}
    >
      {props.children}
    </button>
  );
};

const Account: NextPage = () => {
  const auth = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState(auth.user?.email ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const isPremium = useMemo(() => auth.user?.plan?.type === PlanType.PREMIUM, [auth.user]);
  const { confirmModalProps, openConfirm } = useConfirm();

  const handleFirebaseError = (errorCode: string) => {
    if (errorCode === 'auth/weak-password') {
      toast('Please use a stronger password.');
    } else if (errorCode === 'auth/email-already-in-use') {
      toast('An account already exists with this email address.');
    } else if (errorCode === 'auth/invalid-password') {
      toast('Please use a stronger password.');
    } else {
      toast('Something went wrong.');
    }
  };

  const handleSubscriptionClick = async () => {
    if (!isPremium) {
      router.push('/upgrade');
    } else {
      const response = await API.createPortalSession();
      window.location.href = response.url;
    }
  };

  const updateEmail = async (e) => {
    e.preventDefault();

    if (window.confirm('You will have to login again after changing your email. Continue?')) {
      try {
        await API.updateEmail(email);
        trackGoal('Y0RW35HC', 0);
        auth.logout();
      } catch (err) {
        if (err.response.data.code) {
          handleFirebaseError(err.response.data.code);
        } else if (err.response.data.error) {
          toast(err.response.data.error);
        } else if (err.code) {
          handleFirebaseError(err.code);
        } else {
          toast('Something went wrong.');
        }
      }
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();

    if (
      window.confirm('You will have to login again after changing your password. Continue?')
    ) {
      try {
        await API.updatePassword(newPassword, confirmNewPassword);
        trackGoal('PK6V5J22', 0);
        auth.logout();
      } catch (err) {
        if (err.response.data.code) {
          handleFirebaseError(err.response.data.code);
        } else if (err.response.data.error) {
          toast(err.response.data.error);
        } else if (err.code) {
          handleFirebaseError(err.code);
        } else {
          toast('Something went wrong.');
        }
      }
    }
  };

  const deleteAccount = async (e) => {
    e.preventDefault();

    const confirm = await openConfirm({
      description:
        'Are you sure you want to delete your account? Your data will be permanently erased.',
    });

    if (confirm) {
      try {
        await API.deleteAccount();
        alert("Your account has been deleted. We're sorry to see you go!");
        auth.logout();
      } catch (err) {
        if (err.response.data.error) {
          toast(err.response.data.error);
        } else {
          toast('Something went wrong.');
        }
      }
    }
  };

  return (
    <RequiredLoggedIn>
      <ConfirmModal {...confirmModalProps} />

      <Layout title="Account | Snowball">
        <div className="flex items-center mb-7">
          <h1 className="font-bold text-[1.75rem]">Your Account</h1>
        </div>

        <div className="mx-auto text-sm divide-y divide-gray lg:py-8">
          {/* Update email */}
          <section className="grid gap-6 py-10 lg:grid-cols-3 lg:gap-8 sm:py-12">
            <div>
              <h2 className="mb-2 text-base font-semibold text-dark">Email address</h2>
              <p className="mb-4 text-darkgray">
                Update your email address associated with your account.
              </p>
            </div>

            <form onSubmit={updateEmail} className="lg:col-span-2" autoComplete="off">
              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 font-medium text-darkgray">
                  Email address
                </label>
                <div className="relative max-w-sm">
                  <TextInput
                    name="email"
                    value={email}
                    required
                    placeholder="Email"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="sm:flex sm:items-center sm:space-x-4 sm:space-x-reverse">
                <Btn>Update Email</Btn>
              </div>
            </form>
          </section>

          <section className="grid gap-6 py-10 lg:grid-cols-3 lg:gap-8 sm:py-12">
            <div>
              <h2 className="mb-2 text-base font-semibold text-dark">Subscription</h2>
              <p>
                Snowball Premium is a monthly subscription that gives you access to more
                alerts, more portfolios and more assets.
              </p>
            </div>

            <div className="relative flex p-4 pr-0 -m-4 overflow-auto lg:col-span-2 sm:overflow-visible sm:block sm:m-0 sm:p-0">
              <div className="pr-4 sm:pr-0">
                <table className="w-full bg-white rounded-md shadow min-w-screen-sm sm:min-w-0">
                  <caption className="sr-only">Subscription</caption>
                  <thead className="text-left border-b text-darkgray border-gray">
                    <tr>
                      <th className="w-full px-4 py-3 font-medium">Current Plan</th>
                      <th className="px-4 py-3 font-medium">Price</th>
                      <th className="px-4 py-3">
                        <span className="sr-only">Receipt</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 whitespace-nowrap">
                    <tr>
                      <td className="p-4 font-medium text-dark">
                        {!isPremium ? 'Free Plan' : 'Premium Plan'}
                      </td>
                      <td className="p-4 font-medium text-dark">
                        {!isPremium ? 'Free' : '$10/mo'}
                      </td>
                      <td className="py-4 pl-8 pr-4 font-medium xl:pr-7">
                        <button
                          onClick={handleSubscriptionClick}
                          className="px-4 py-2 font-semibold text-white transition-colors duration-150 rounded-md bg-evergreen hover:bg-opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-evergreen focus:outline-none"
                        >
                          {!isPremium ? 'Upgrade to Premium' : 'Manage Subscription'}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Update password */}
          <section className="grid gap-6 py-10 lg:grid-cols-3 lg:gap-8 sm:py-12">
            <div>
              <h2 className="mb-2 text-base font-semibold text-dark">Password</h2>
              <p className="mb-4 text-darkgray">
                Update your password associated with your account.
              </p>
            </div>

            <form onSubmit={updatePassword} className="lg:col-span-2" autoComplete="off">
              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 font-medium text-darkgray">
                  New password
                </label>
                <div className="relative max-w-sm">
                  <TextInput
                    name="newPassword"
                    value={newPassword}
                    required
                    placeholder="New password"
                    type="password"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 font-medium text-darkgray">
                  Confirm new password
                </label>
                <div className="relative max-w-sm">
                  <TextInput
                    name="confirmNewPassword"
                    required
                    value={confirmNewPassword}
                    placeholder="Confirm new password"
                    type="password"
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="sm:flex sm:items-center sm:space-x-4 sm:space-x-reverse">
                <Btn>Update Password</Btn>
              </div>
            </form>
          </section>

          {/* Delete account */}
          <section className="grid gap-6 py-10 lg:grid-cols-3 lg:gap-8 sm:py-12">
            <div>
              <h2 className="mb-2 text-base font-semibold text-dark">Account</h2>
              <p className="mb-4 text-darkgray">Manage your account</p>
            </div>

            <form onSubmit={deleteAccount} className="lg:col-span-2" autoComplete="off">
              <div className="sm:flex sm:items-center sm:space-x-4 sm:space-x-reverse">
                <Btn red>Delete Account</Btn>
              </div>
            </form>
          </section>
        </div>
      </Layout>
    </RequiredLoggedIn>
  );
};

export default Account;
