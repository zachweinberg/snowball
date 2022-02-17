import { AssetType } from '@zachweinberg/obsidian-schema';
import { trackGoal } from 'fathom-client';
import { useCallback, useEffect, useState } from 'react';
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link';
import * as Yup from 'yup';
import * as yup from 'yup';
import { API } from '~/lib/api';
import { formatMoneyFromNumber } from '~/lib/money';
import Button from '../ui/Button';
import MoneyInput from '../ui/MoneyInput';
import QuantityInput from '../ui/QuantityInput';
import Spinner from '../ui/Spinner';
import TextInputWithResults from '../ui/TextInputWithResults';

const addStockSchema = yup.object().shape({
  symbol: Yup.string()
    .max(6, 'That stock symbol is too long.')
    .required('Stock symbol is required.'),
  quantity: Yup.number()
    .typeError('Please enter a valid quantity.')
    .min(1, 'You must own more than 0 shares.')
    .max(100000000, 'Are you sure you own that many shares?')
    .required('Quantity of shares is required.'),
  costPerShare: Yup.number()
    .typeError('Please enter a valid cost per share.')
    .min(0.01, 'Cost basis must be greater than 0.')
    .required('Cost basis is required.'),
  companyName: Yup.string().required('Please select a ticker symbol.'),
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
  const [costPerShare, setCostPerShare] = useState<number | null>(null);
  const [currPrice, setCurrPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [linkToken, setLinkToken] = useState<string | null>(null);

  const canAdd = symbol && costPerShare && costPerShare > 0 && quantity && quantity > 0;

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (publicToken, metadata) => {
    setLoading(true);

    const institutionName = metadata.institution?.name ?? 'Brokerage';
    const institutionID = metadata.institution?.institution_id ?? '';
    const accounts = metadata.accounts;

    await API.exchangeTokenForStockItem(
      portfolioID,
      publicToken,
      accounts[0],
      institutionName,
      institutionID
    );

    setLoading(false);
    trackGoal('W0HYS772', 0);

    afterAdd();
  }, []);

  const config: PlaidLinkOptions = {
    token: linkToken ?? '',
    onSuccess,
    language: 'en',
    countryCodes: ['US'],
  };

  const fetchLinkToken = async () => {
    const tokenResponse = await API.getPlaidLinkToken(AssetType.Stock);
    localStorage.setItem('link_token', tokenResponse.data.link_token);
    setLinkToken(tokenResponse.data.link_token);
  };

  useEffect(() => {
    fetchLinkToken();
  }, []);

  const { open, ready } = usePlaidLink(config);

  const openLink = () => {
    open();
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    let isValid = false;

    try {
      await addStockSchema.validate({
        costPerShare,
        symbol,
        companyName,
        quantity,
      });
      isValid = true;
    } catch (err) {
      setError(err.errors?.[0] ?? '');
    }

    if (isValid) {
      setLoading(true);

      try {
        await API.addStockToPortfolio({
          portfolioID,
          symbol,
          costPerShare: costPerShare as number,
          companyName,
          quantity: quantity as number,
        });

        trackGoal('GQJWAT79', 0);
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

      {loading ? (
        <div className="flex justify-center mb-5">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex justify-center pb-10 border-b border-gray">
            <Button type="button" className="w-1/2" onClick={openLink} disabled={!ready}>
              Import From Brokerage
            </Button>
          </div>

          <p className="pt-10 text-sm font-medium text-center mb-7 text-darkgray">
            Or, manually add a stock:
          </p>

          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm text-darkgray">Symbol</div>
              <div className="flex text-sm text-darkgray">
                <p>{companyName}</p>
                {currPrice && (
                  <p className="ml-1">- Current price: {formatMoneyFromNumber(currPrice)}</p>
                )}
              </div>
            </div>
            <TextInputWithResults
              placeholder="Add stock"
              backgroundColor="#F9FAFF"
              type={AssetType.Stock}
              autofocus
              floatingResults
              onError={(e) => setError(e)}
              onResult={(symbol, fullName) => {
                setCurrPrice(null);

                API.getQuote(symbol, AssetType.Stock).then((data) => {
                  if (data.latestPrice && typeof data.latestPrice === 'number') {
                    setCurrPrice(data.latestPrice);
                  }
                });

                setSymbol(symbol.toUpperCase());
                setCompanyName(fullName);
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <div className="mb-1 text-sm text-darkgray">Quantity</div>
              <QuantityInput
                placeholder="Quantity"
                required
                value={quantity}
                backgroundColor="#F9FAFF"
                name="quantity"
                onChange={(val) => setQuantity(Number(val))}
              />
            </div>
            <div>
              <div className="mb-1 text-sm text-darkgray">Cost Per Share</div>
              <MoneyInput
                placeholder="Cost Per Share"
                required
                value={costPerShare}
                name="costPerShare"
                onChange={(val) => setCostPerShare(val)}
              />
            </div>
          </div>
        </>
      )}

      {error && <p className="mb-6 leading-5 text-left text-red">{error}</p>}

      <Button type="submit" disabled={loading}>
        {canAdd
          ? `Add ${quantity} shares of ${symbol} for ${formatMoneyFromNumber(
              costPerShare * quantity
            )}`
          : 'Add stock'}
      </Button>
    </form>
  );
};

export default AddStockForm;
