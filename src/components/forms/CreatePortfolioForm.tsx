import classNames from 'classnames';
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

interface Props {
  firstTime?: boolean;
}

const CreatePortfolioForm: React.FunctionComponent<Props> = ({ firstTime }: Props) => {
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
        <Form className={classNames('p-10 bg-white', { 'shadow-sm rounded-md': firstTime })}>
          <p
            className={classNames('font-bold tracking-wide text-blue3', {
              'mb-5 text-2xl': firstTime,
              'mb-8 text-3xl': !firstTime,
            })}
          >
            {firstTime ? 'Create your first portfolio' : 'Create Portfolio'}
          </p>

          {firstTime && (
            <p className="mb-5 text-sm text-purple2">
              Each portfolio you create can hold your various assets like stocks, crypto, real
              estate, cash and more.
            </p>
          )}

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
