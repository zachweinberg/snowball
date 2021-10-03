import { AssetType } from '@zachweinberg/wealth-schema';
import currency from 'currency.js';
import { useState } from 'react';
import * as Yup from 'yup';
import * as yup from 'yup';
import TextInput from '~/components/ui/TextInput';
import { SearchPositionsResult } from '~/lib/algolia';
import { API } from '~/lib/api';
import { formatMoneyFromNumber } from '~/lib/money';
import Button from '../ui/Button';
import MoneyInput from '../ui/MoneyInput';
import TextArea from '../ui/TextArea';
import TextInputWithResults from '../ui/TextInputWithResults';

const addStockSchema = yup.object().shape({
  symbol: Yup.string()
    .max(8, 'That stock symbol is too long.')
    .required('Stock symbol is required.'),
  quantity: Yup.number()
    .min(0, 'You must own more shares than that!')
    .max(100000000, 'Are you sure you own that many shares?')
    .required('Quantity of shares is required.'),
  costBasis: Yup.number()
    .min(0, 'Cost basis must be greater than 0.')
    .required('Cost basis is required.'),
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
  const [quantity, setQuantity] = useState<number | null>(null);
  const [costBasis, setCostBasis] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [searchResults, setSearchResults] = useState<SearchPositionsResult[]>([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    let isValid = false;

    try {
      await addStockSchema.validate({
        costBasis,
        symbol,
        companyName,
        quantity,
        note,
      });
      isValid = true;
    } catch (err) {
      setError(err.errors?.[0] ?? '');
    }

    if (isValid) {
      setLoading(true);

      const numberCostBasis = currency(costBasis as number).value;
      try {
        await API.addStockToPortfolio({
          portfolioID,
          symbol,
          costBasis: numberCostBasis,
          companyName,
          quantity: quantity as number,
          note: note ?? '',
        });

        afterAdd();
      } catch (err) {
        if (err.response?.data?.error) {
          setError(err.response.data.error);
        } else {
          setError('Could not add stock.');
        }

        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col max-w-lg mx-auto" autoComplete="off">
      <div
        className="flex items-center justify-center mb-10 cursor-pointer text-darkgray text-[.95rem] font-semibold"
        onClick={goBack}
      >
        <svg
          className="w-5 h-5 mr-2 fill-current"
          viewBox="0 0 25 12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.283852 5.31499C0.284142 5.3147 0.284384 5.31436 0.284724 5.31407L5.34137 0.281805C5.72019 -0.095179 6.33292 -0.0937761 6.71 0.285095C7.08703 0.663918 7.08558 1.27664 6.70676 1.65368L3.31172 5.03226L23.8065 5.03226C24.341 5.03226 24.7742 5.46552 24.7742 6C24.7742 6.53448 24.341 6.96774 23.8065 6.96774L3.31177 6.96774L6.70671 10.3463C7.08554 10.7234 7.08699 11.3361 6.70995 11.7149C6.33287 12.0938 5.7201 12.0951 5.34132 11.7182L0.284674 6.68594C0.284384 6.68565 0.284142 6.68531 0.283805 6.68502C-0.0952124 6.30673 -0.0940032 5.69202 0.283852 5.31499Z"
            fill="#757784"
          />
        </svg>
        Back
      </div>

      <h2 className="mb-3 text-center text-[1.75rem] font-bold">Add a Stock</h2>

      <p className="text-center mb-7 text-darkgray text-[1rem] font-medium">
        Add a specific equity to your portfolio.
      </p>

      <TextInputWithResults
        placeholder="Add stock"
        backgroundColor="#F9FAFF"
        type={AssetType.Stock}
        floatingResults
        onError={(e) => setError(e)}
        onResult={(symbol, fullName) => {
          API.getQuote(symbol, AssetType.Stock).then((quoteData) => {
            if (quoteData.status === 'ok') {
              setCostBasis(quoteData.latestPrice);
            }
          });

          setSymbol(symbol.toUpperCase());
          setCompanyName(fullName);
        }}
      />

      <div className="grid grid-cols-2 gap-6 mb-4">
        <TextInput
          placeholder="Quantity"
          required
          value={quantity}
          backgroundColor="#F9FAFF"
          type="number"
          name="quantity"
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <MoneyInput
          placeholder="Cost Per Share"
          required
          value={costBasis}
          name="costBasis"
          onChange={(value) => setCostBasis(value)}
        />
      </div>

      <TextArea
        name="note"
        placeholder="Note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="mb-7"
      />

      <div className="space-y-2 font-medium text-center mb-7 text-darkgray">
        {companyName && costBasis && quantity && (
          <>
            <p>{companyName}</p>
            <p>
              {quantity} shares at {formatMoneyFromNumber(costBasis)} per share
            </p>
            <p>Total cost basis: {formatMoneyFromNumber(quantity * costBasis)}</p>
          </>
        )}
      </div>

      {error && <p className="mb-4 text-center text-red">{error}</p>}

      <Button type="submit" disabled={loading}>
        Add stock to portfolio
      </Button>
    </form>
  );
};

export default AddStockForm;
