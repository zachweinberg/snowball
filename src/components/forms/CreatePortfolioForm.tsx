import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Button from '~/components/Button';
import TextInput from '~/components/TextInput';

interface Values {
  portfolioName: string;
}

const validationSchema = Yup.object({
  portfolioName: Yup.string()
    .max(45, 'Must be 45 characters or less')
    .required('Portfolio name is required'),
});

const CreatePortfolioForm: React.FunctionComponent = () => {
  const onSubmit = async (userData: Values, actions: FormikHelpers<Values>) => {
    //
  };

  return (
    <Formik
      initialValues={{
        portfolioName: '',
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <Form className="bg-white p-10 shadow-sm rounded-md">
          <p className="mb-8 text-3xl font-bold tracking-wide text-blue3">Create Portfolio</p>

          <div className="mb-5">
            <TextInput
              label="Portfolio name"
              name="portfolioName"
              type="text"
              placeholder="Enter name..."
            />
          </div>

          <Button type="submit" className="mt-3">
            Create portfolio
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default CreatePortfolioForm;
