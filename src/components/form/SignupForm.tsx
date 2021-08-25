import { InvestingExperienceLevel } from '@zachweinberg/wealth-schema';
import { Form, Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import Button from '~/components/Button';
import Select from '~/components/form/Select';
import TextInput from '~/components/form/TextInput';
import { useAuth } from '~/hooks/useAuth';

interface Values {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  investingExperienceLevel: InvestingExperienceLevel;
}

const validationSchema = Yup.object({
  name: Yup.string().max(35, 'Must be 35 characters or less').required('Name is required'),
  email: Yup.string()
    .max(40, 'Must be 40 characters or less')
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Passwords must match'),
  investingExperienceLevel: Yup.string()
    .oneOf([
      InvestingExperienceLevel.LessThanOneYear,
      InvestingExperienceLevel.OverFiveYears,
      InvestingExperienceLevel.TwoToFiveYears,
    ])
    .required('Required'),
});

const SignupForm: React.FunctionComponent = () => {
  const auth = useAuth();
  const [error, setError] = useState<string>('');

  const onSubmit = async (userData: Values, actions: FormikHelpers<Values>) => {
    if (userData.password !== userData.confirmPassword) {
      actions.setFieldError('confirmPassword', 'Passwords must match');
      actions.setSubmitting(false);
      return;
    }

    actions.setSubmitting(true);

    try {
      await auth.signup(userData);
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Could not create account.');
      }
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        investingExperienceLevel: InvestingExperienceLevel.LessThanOneYear,
        confirmPassword: '',
        password: '',
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <Form className="bg-white rounded-md shadow-md p-9">
          <p className="mb-8 text-3xl font-semibold tracking-wide text-blue3">
            Create an account
          </p>

          <div className="mb-5">
            <TextInput label="Name" name="name" type="text" placeholder="Enter name" />
          </div>

          <div className="mb-5">
            <Select label="Investing Experience" name="investingExperienceLevel">
              <option value="" disabled>
                Select investing experience level
              </option>
              <option value={InvestingExperienceLevel.LessThanOneYear}>
                Less than a year
              </option>
              <option value={InvestingExperienceLevel.TwoToFiveYears}>2 to 5 years</option>
              <option value={InvestingExperienceLevel.OverFiveYears}>Over 5 years</option>
            </Select>
          </div>

          <div className="mb-5">
            <TextInput label="Email" name="email" type="email" placeholder="Enter email" />
          </div>

          <div className="mb-5">
            <TextInput
              label="Password"
              name="password"
              type="password"
              placeholder="Enter password"
            />
          </div>

          <div className="mb-5">
            <TextInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
            />
          </div>

          {error && <p className="mb-1 text-sm text-red3">{error}</p>}

          <Button type="submit" className="mt-3" disabled={formik.isSubmitting}>
            Create account
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default SignupForm;
