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
import Spinner from '../ui/Spinner';
import TextInput from '../ui/TextInput';

const addCashSchema = yup.object().shape({
  accountName: Yup.string()
    .min(1, 'Please use a longer account name.')
    .max(30, 'Please use a shorter account name.')
    .required('Account name is required.'),
  amount: Yup.number()
    .typeError('Please enter a valid amount.')
    .min(0.01, 'You must have more cash than that.')
    .max(1000000000, 'Are you sure you have that much cash?')
    .required('Cash amount is required.'),
});

interface Props {
  afterAdd: () => void;
  goBack: () => void;
  portfolioID: string;
}

const AddCashForm: React.FunctionComponent<Props> = ({
  afterAdd,
  portfolioID,
  goBack,
}: Props) => {
  const [error, setError] = useState<string>('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [linkToken, setLinkToken] = useState<string | null>(null);

  const canAdd = amount && amount > 0 && accountName;

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (publicToken, metadata) => {
    setLoading(true);

    const institutionName = metadata.institution?.name ?? 'Bank';
    const institutionID = metadata.institution?.institution_id ?? '';
    const accounts = metadata.accounts;

    await API.exchangeTokenForCashItem(
      portfolioID,
      publicToken,
      accounts[0],
      institutionName,
      institutionID
    );

    setLoading(false);
    trackGoal('2FZCG11L', 0);

    afterAdd();
  }, []);

  const config: PlaidLinkOptions = {
    token: linkToken ?? '',
    onSuccess,
    language: 'en',
    countryCodes: ['US'],
  };

  const fetchLinkToken = async () => {
    const tokenResponse = await API.getPlaidLinkToken(AssetType.Cash);
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
      await addCashSchema.validate({
        accountName,
        amount,
      });
      isValid = true;
    } catch (err) {
      setError(err.errors?.[0] ?? '');
    }

    if (isValid) {
      setLoading(true);

      try {
        await API.addCashToPortfolio({
          amount: amount as number,
          accountName,
          portfolioID,
        });

        trackGoal('OCOIOYIL', 0);

        afterAdd();
      } catch (err) {
        if (err.response?.data?.error) {
          setError(err.response.data.error);
        } else {
          setError('Could not add cash.');
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
        Add different asset type
      </div>

      <h2 className="mb-7 text-center text-[1.75rem] font-bold">Add Cash</h2>

      <p className="text-sm font-medium text-center mb-7 text-darkgray">
        Link a bank account to automatically update your cash holdings:
      </p>

      {loading ? (
        <div className="flex justify-center mb-5">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex justify-center pb-10 border-b border-gray">
            <Button type="button" className="w-1/2" onClick={openLink} disabled={!ready}>
              Link Bank
            </Button>
          </div>

          <p className="pt-10 text-sm font-medium text-center mb-7 text-darkgray">
            Or, manually add cash and update it when you want:
          </p>

          <TextInput
            placeholder="Account name"
            backgroundColor="#F9FAFF"
            type="text"
            className="mb-4"
            value={accountName}
            autofocus
            name="accountName"
            onChange={(e) => setAccountName(e.target.value)}
          />

          <MoneyInput
            placeholder="Cash amount"
            required
            value={amount}
            name="amount"
            className="mb-4"
            numDecimals={2}
            onChange={(val) => setAmount(val)}
          />
        </>
      )}

      {error && <p className="mb-6 leading-5 text-left text-red">{error}</p>}

      <Button type="submit" disabled={loading}>
        {canAdd ? `Add ${accountName} with ${formatMoneyFromNumber(amount)}` : 'Add Cash'}
      </Button>
    </form>
  );
};

export default AddCashForm;
