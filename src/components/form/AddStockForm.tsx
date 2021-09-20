import currency from 'currency.js';
import { useState } from 'react';
import * as Yup from 'yup';
import * as yup from 'yup';
import TextInput from '~/components/ui/TextInput';
import { API } from '~/lib/api';
import Typography from '../ui/Typography';

const addStockSchema = yup.object().shape({
  symbol: Yup.string()
    .max(8, 'That stock symbol is too long.')
    .required('Stock symbol is required.'),
  quantity: Yup.number()
    .min(0, 'You must own more shares than that!')
    .max(100000000, 'Are you sure you own that many shares?')
    .required('Quantity of shares is required.'),
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

  const onSubmit = async (e) => {
    e.preventDefault();

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
    <form onSubmit={onSubmit} className="flex flex-col">
      <Typography element="span" className="cursor-pointer" variant="Link">
        Go back
      </Typography>

      <Typography element="h2" variant="Headline1">
        Add a Stock
      </Typography>
      <Typography element="p" variant="Paragraph">
        Add a specific equity to your portfolio.
      </Typography>

      <TextInput placeholder="Ticker Symbol" type="text" />

      <div className="grid grid-cols-2 gap-6">
        <TextInput placeholder="Quantity" />
        <TextInput placeholder="Cost per share" />
      </div>

      <textarea>hi</textarea>

      <Button>Add stock to portfolio</Button>
    </form>
  );
};

export default AddStockForm;
