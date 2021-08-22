import { InvestingExperienceLevel } from '@zachweinberg/wealth-schema';
import { Form, Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import Button from '~/components/Button';
import TextInput from '~/components/TextInput';
import { useAuth } from '~/hooks/useAuth';
import Select from '../Select';

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
    .min(5, 'Password must be over 5 characters')
    .required('Password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
  investingExperienceLevel: Yup.string().oneOf([
    InvestingExperienceLevel.LessThanOneYear,
    InvestingExperienceLevel.OverFiveYears,
    InvestingExperienceLevel.TwoToFiveYears,
  ]),
});

const SignupForm: React.FunctionComponent = () => {
  const auth = useAuth();
  const [error, setError] = useState<string>('');

  const onSubmit = async (userData: Values, actions: FormikHelpers<Values>) => {
    try {
      await auth.signup(userData);
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      }
    }
  };

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        investingExperienceLevel: InvestingExperienceLevel.OverFiveYears,
        confirmPassword: '',
        password: '',
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <Form className="bg-white p-10 shadow-sm rounded-md">
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

          <Button type="submit" className="mt-3">
            Create account
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default SignupForm;
