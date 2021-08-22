import { InvestingExperienceLevel } from '@wealth/schema';
import { Formik, FormikHelpers } from 'formik';
import Yup from 'yup';
import { useAuth } from '~/hooks/useAuth';

interface Values {
  email: string;
  password: string;
  name: string;
  investingExperienceLevel: InvestingExperienceLevel;
}

const SignupForm: React.FunctionComponent = () => {
  const auth = useAuth();

  const onSubmit = async (userData: Values, actions: FormikHelpers<Values>) => {
    try {
      await auth.signup(userData);
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      }

      console.log(err.response.data.error);
    }
  };

  return (
    <Formik
      initialValues={{ name: '', email: '', investingExperienceLevel: '', password: '' }}
      validationSchema={Yup.object({
        name: Yup.string().max(35, 'Must be 35 characters or less').required('Required'),
        email: Yup.string().max(40, 'Must be 40 characters or less').required('Required'),
        password: Yup.string()
          .min(5, 'Password must be over 5 characters')
          .email('Invalid email address')
          .required('Required'),
        investingExperienceLevel: Yup.string().oneOf([
          InvestingExperienceLevel.LessThanOneYear,
          InvestingExperienceLevel.OverFiveYears,
          InvestingExperienceLevel.TwoToFiveYears,
        ]),
      })}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit}>
          <label htmlFor="firstName">First Name</label>
          <input id="firstName" type="text" {...formik.getFieldProps('firstName')} />
          {formik.touched.firstName && formik.errors.firstName ? (
            <div>{formik.errors.firstName}</div>
          ) : null}

          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" type="text" {...formik.getFieldProps('lastName')} />
          {formik.touched.lastName && formik.errors.lastName ? (
            <div>{formik.errors.lastName}</div>
          ) : null}

          <label htmlFor="email">Email Address</label>
          <input id="email" type="email" {...formik.getFieldProps('email')} />
          {formik.touched.email && formik.errors.email ? (
            <div>{formik.errors.email}</div>
          ) : null}

          <button type="submit">Submit</button>
        </form>
      )}
    </Formik>
  );

  // <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-md shadow-md p-10">
  //   <p className="mb-8 text-2xl font-semibold tracking-wide text-blue3 text-center">
  //     Create your account
  //   </p>

  //   <div className="mb-5">
  //     <TextInput
  //       name="name"
  //       required
  //       register={register}
  //       type="text"
  //       label="Your Name"
  //       placeholder="Enter name"
  //       error={errors.name?.message}
  //     />
  //   </div>

  //   <div className="mb-5">
  //     <TextInput
  //       name="email"
  //       required
  //       register={register}
  //       type="email"
  //       label="Email"
  //       placeholder="Enter email"
  //       error={errors.email?.message}
  //     />
  //   </div>

  //   <div className="mb-5">
  //     <TextInput
  //       name="password"
  //       required
  //       register={register}
  //       type="password"
  //       label="Password"
  //       placeholder="Enter password"
  //       error={errors.password?.message}
  //     />
  //   </div>

  //   <div className="mb-5">
  //     <Select
  //       required
  //       name="investingExperienceLevel"
  //       register={register}
  //       label="Investing Experience"
  //       options={[
  //         InvestingExperienceLevel.LessThanOneYear,
  //         InvestingExperienceLevel.TwoToFiveYears,
  //         InvestingExperienceLevel.OverFiveYears,
  //       ]}
  //     />
  //   </div>

  //   {error !== '' && <p className="text-sm text-red3 mb-3">{error}</p>}

  //   <Button type="submit" className="mt-3" disabled={isSubmitting}>
  //     Create account
  //   </Button>
  // </form>
};

export default SignupForm;
