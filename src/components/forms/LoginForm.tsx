import { Form, Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import Button from '~/components/Button';
import TextInput from '~/components/TextInput';
import { useAuth } from '~/hooks/useAuth';

interface Values {
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const LoginForm: React.FunctionComponent = () => {
  const auth = useAuth();

  const [error, setError] = useState<string>('');
  const onSubmit = async (userData: Values, actions: FormikHelpers<Values>) => {
    actions.setSubmitting(true);

    try {
      await auth.login(userData.email, userData.password);
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Could not login.');
      }
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <Form className="p-10 bg-white rounded-md shadow-md">
          <p className="mb-8 text-3xl font-bold tracking-wide text-blue3">Login</p>

          <div className="mb-5">
            <TextInput label="Email" name="email" type="email" placeholder="Enter email..." />
          </div>

          <div className="mb-5">
            <TextInput
              label="Password"
              name="password"
              type="password"
              placeholder="Enter password..."
            />
          </div>

          {error && <p className="mb-1 text-sm text-red3">{error}</p>}

          <Button type="submit" className="mt-3" disabled={formik.isSubmitting}>
            Login
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
