import currency from 'currency.js';
import debounce from 'lodash/debounce';
import { useCallback, useState } from 'react';
import * as Yup from 'yup';
import * as yup from 'yup';
import TextInput from '~/components/ui/TextInput';
import { SearchPositionsResult, searchStocks } from '~/lib/algolia';
import { API } from '~/lib/api';
import Button from '../ui/Button';
import InputResults from '../ui/InputResults';
import TextArea from '../ui/TextArea';
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
  goBack: () => void;
  portfolioID: string;
}

const AddStockForm: React.FunctionComponent<Props> = ({
  afterAdd,
  portfolioID,
  goBack,
}: Props) => {
  const [error, setError] = useState<string>('');
  const [symbol, setSymbol] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [costBasis, setCostBasis] = useState(0);
  const [note, setNote] = useState('');
  const [searchResults, setSearchResults] = useState<SearchPositionsResult[]>([]);

  const search = async (query) => {
    const response = await searchStocks(query);
    setSearchResults(response);
  };

  const debouncedSearch = useCallback(
    debounce((query) => search(query), 100),
    []
  );

  const onSubmit = async (e) => {
    e.preventDefault();

    const numberCostBasis = currency(costBasis).value;

    try {
      await API.addStockToPortfolio({
        portfolioID,
        symbol,
        costBasis: numberCostBasis,
        companyName,
        quantity,
        note: note ?? '',
      });
      afterAdd();
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Could not add stock.');
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col max-w-lg mx-auto" autoComplete="off">
      <Typography
        element="div"
        className="cursor-pointer mb-10 text-darkgray flex items-center justify-center"
        variant="Link"
        onClick={goBack}
      >
        <svg
          className="h-5 w-5 fill-current mr-2"
          viewBox="0 0 25 12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.283852 5.31499C0.284142 5.3147 0.284384 5.31436 0.284724 5.31407L5.34137 0.281805C5.72019 -0.095179 6.33292 -0.0937761 6.71 0.285095C7.08703 0.663918 7.08558 1.27664 6.70676 1.65368L3.31172 5.03226L23.8065 5.03226C24.341 5.03226 24.7742 5.46552 24.7742 6C24.7742 6.53448 24.341 6.96774 23.8065 6.96774L3.31177 6.96774L6.70671 10.3463C7.08554 10.7234 7.08699 11.3361 6.70995 11.7149C6.33287 12.0938 5.7201 12.0951 5.34132 11.7182L0.284674 6.68594C0.284384 6.68565 0.284142 6.68531 0.283805 6.68502C-0.0952124 6.30673 -0.0940032 5.69202 0.283852 5.31499Z"
            fill="#757784"
          />
        </svg>
        Back
      </Typography>

      <Typography element="h2" variant="Headline1" className="mb-3 text-center">
        Add a Stock
      </Typography>

      <Typography element="p" variant="Paragraph" className="mb-7 text-darkgray text-center">
        Add a specific equity to your portfolio.
      </Typography>

      <div className="relative mb-4">
        <TextInput
          placeholder="Ticker Symbol"
          type="text"
          name="symbol"
          value={symbol}
          onChange={(e) => {
            const q = e.target.value;

            setSymbol(q);

            if (q === '') {
              setSearchResults([]);
            } else {
              debouncedSearch(q);
            }
          }}
        />

        <InputResults
          onSelect={(symbol, fullName) => {
            if (!symbol) {
              setSearchResults([]);
            }
          }}
          searchResults={searchResults}
        />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-4">
        <TextInput
          placeholder="Quantity"
          value={quantity}
          name="quantity"
          onChange={(e) => setQuantity(e.target.value)}
        />
        <TextInput
          placeholder="Cost per share"
          value={costBasis}
          name="costBasis"
          onChange={(e) => setCostBasis(e.target.value)}
        />
      </div>

      <TextArea
        name="note"
        placeholder="Note (optional)"
        value={name}
        onChange={(e) => setNote(e.target.value)}
        className="mb-14"
      />

      <Button type="submit">Add stock to portfolio</Button>
    </form>
  );
};

export default AddStockForm;
