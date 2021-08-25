import currency from 'currency.js';
import { Form, Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import Button from '~/components/Button';
import MoneyInput from '~/components/form/MoneyInput';
import PositionSelector from '~/components/form/PositionSelector';
import TextInput from '~/components/form/TextInput';
import { searchStocks } from '~/lib/algolia';
import { API } from '~/lib/api';

interface Values {
  symbol: string;
  quantity: number;
  costBasis: string;
  companyName: string;
  note?: string;
}

const validationSchema = Yup.object({
  symbol: Yup.string()
    .max(10, 'That stock symbol is too long.')
    .required('Stock symbol is required.'),
  quantity: Yup.number()
    .min(0, 'You must own more shares than that!')
    .max(1000000000, 'Are you sure you own that many shares?')
    .required('Quantity is required.'),
  costBasis: Yup.string().required('Cost basis is required.'),
  companyName: Yup.string().required('Please select a ticker symbol.'),
  note: Yup.string(),
});

interface Props {
  afterAdd: () => void;
  portfolioID: string;
}

const AddStockForm: React.FunctionComponent<Props> = ({ afterAdd, portfolioID }: Props) => {
  const [error, setError] = useState<string>('');

  const onSubmit = async (data: Values, actions: FormikHelpers<Values>) => {
    actions.setSubmitting(true);

    const numberCostBasis = currency(data.costBasis).value;

    try {
      const stockData = { ...data, costBasis: numberCostBasis, portfolioID };
      await API.addStockToPortfolio(stockData);
      afterAdd();
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Could not add stock.');
      }

      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        symbol: '',
        quantity: 1,
        costBasis: '',
        companyName: '',
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <Form className="bg-white">
          <p className="mb-8 text-3xl font-bold tracking-wide text-blue3">Add a Stock</p>
          <div className="mb-5">
            <PositionSelector
              label="Ticker symbol"
              name="symbol"
              placeholder="Example: AAPL"
              fetcher={searchStocks}
              onSelect={(symbol, fullName) => {
                formik.setFieldValue('symbol', symbol);
                formik.setFieldValue('companyName', fullName);
              }}
            />
          </div>

          <div className="mb-5">
            <TextInput
              label="Quantity"
              name="quantity"
              type="number"
              placeholder="Enter number of shares"
            />
          </div>

          <div className="mb-5">
            <MoneyInput
              name="costBasis"
              placeholder="Enter cost per share"
              label="Cost Basis"
            />
          </div>

          <div className="mb-5">
            <TextInput label="Note" name="note" type="text" placeholder="Optional note" />
          </div>

          {error && <p className="mb-1 text-sm text-red3">{error}</p>}

          <Button type="submit" className="mt-3" disabled={formik.isSubmitting}>
            Add stock to portfolio
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default AddStockForm;
