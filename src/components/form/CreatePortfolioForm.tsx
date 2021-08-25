import classNames from 'classnames';
import { Form, Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import Button from '~/components/Button';
import TextInput from '~/components/form/TextInput';
import { API } from '~/lib/api';

interface Values {
  portfolioName: string;
}

const validationSchema = Yup.object({
  portfolioName: Yup.string()
    .max(45, 'Must be 45 characters or less')
    .required('Portfolio name is required'),
});

interface Props {
  afterCreate: () => void;
  firstTime?: boolean;
}

const CreatePortfolioForm: React.FunctionComponent<Props> = ({
  afterCreate,
  firstTime,
}: Props) => {
  const [error, setError] = useState<string>('');

  const onSubmit = async (data: Values, actions: FormikHelpers<Values>) => {
    actions.setSubmitting(true);

    try {
      await API.createPortfolio(data.portfolioName, false);
      afterCreate();
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Could not create portfolio.');
      }
      actions.setSubmitting(false);
    }
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
              Each portfolio you create can hold various assets like stocks, crypto, real
              estate, cash and more. You can create multiple portfolios.
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

          {error && <p className="mb-1 text-sm text-red3">{error}</p>}

          <Button type="submit" className="mt-3">
            Create portfolio
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default CreatePortfolioForm;
