import currency from 'currency.js';
import { Form, Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import Button from '~/components/Button';
import TextInput from '~/components/form/TextInput';
import { API } from '~/lib/api';
import MoneyInput from './MoneyInput';

interface Values {
  accountName: string;
  amount: number;
  note?: string;
}

const validationSchema = Yup.object({
  accountName: Yup.string().required('Account name is required.'),
  amount: Yup.number()
    .min(0, 'Please enter a larger amount.')
    .max(1000000000, "That's a pretty big number!")
    .required('Amount of cash is required.'),
  note: Yup.string(),
});

interface Props {
  afterAdd: () => void;
  portfolioID: string;
}

const AddCashForm: React.FunctionComponent<Props> = ({ afterAdd, portfolioID }: Props) => {
  const [error, setError] = useState<string>('');

  const onSubmit = async (data: Values, actions: FormikHelpers<Values>) => {
    actions.setSubmitting(true);

    const numberAmount = currency(data.amount).value;

    try {
      const coinData = { ...data, amount: numberAmount, portfolioID };
      await API.addCashToPortfolio(coinData);
      afterAdd();
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Could not add cash.');
      }

      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        accountName: '',
        amount: 0,
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <Form className="p-10 bg-white">
          <p className="mb-8 text-3xl font-bold tracking-wide text-blue3">Add Cash</p>

          <div className="mb-5">
            <TextInput
              label="Cash Account Name"
              name="accountName"
              type="text"
              placeholder="Enter account name"
            />
          </div>

          <div className="mb-5">
            <MoneyInput label="Cash Amount" name="amount" placeholder="Enter amount" />
          </div>

          {error && <p className="mb-1 text-sm text-red3">{error}</p>}

          <Button type="submit" className="mt-3" disabled={formik.isSubmitting}>
            Add cash to portfolio
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default AddCashForm;
