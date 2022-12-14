import { trackGoal } from 'fathom-client';
import { useState } from 'react';
import * as Yup from 'yup';
import * as yup from 'yup';
import { API } from '~/lib/api';
import { formatMoneyFromNumber } from '~/lib/money';
import Button from '../ui/Button';
import MoneyInput from '../ui/MoneyInput';
import TextInput from '../ui/TextInput';

const addCustomAssetSchema = yup.object().shape({
  assetName: Yup.string()
    .min(1, 'Please use a longer asset name.')
    .max(30, 'Please use a shorter asset name.')
    .required('Asset name is required.'),
  value: Yup.number()
    .typeError('Please enter a valid value.')
    .min(0.01, 'Value too low.')
    .max(1000000000, 'Are you sure your asset is worth that much?')
    .required('Value amount is required.'),
});

interface Props {
  afterAdd: () => void;
  goBack: () => void;
  portfolioID: string;
}

const AddCustomAssetForm: React.FunctionComponent<Props> = ({
  afterAdd,
  portfolioID,
  goBack,
}: Props) => {
  const [error, setError] = useState<string>('');
  const [assetName, setAssetName] = useState('');
  const [value, setValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const canAdd = value && value > 0 && assetName;

  const onSubmit = async (e) => {
    e.preventDefault();

    let isValid = false;

    try {
      await addCustomAssetSchema.validate({
        assetName,
        value,
      });
      isValid = true;
    } catch (err) {
      setError(err.errors?.[0] ?? '');
    }

    if (isValid) {
      setLoading(true);

      try {
        await API.addCustomAssetToPortfolio({
          value: value as number,
          assetName,
          portfolioID,
        });

        trackGoal('H0SJYJGY', 0);

        afterAdd();
      } catch (err) {
        if (err.response?.data?.error) {
          setError(err.response.data.error);
        } else {
          setError('Could not add custom asset.');
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

      <h2 className="mb-3 text-center text-[1.75rem] font-bold">Add Custom Asset</h2>

      <p className="text-center mb-7 text-darkgray text-[1rem] font-medium">
        Add a custom asset to your portfolio:
      </p>

      <TextInput
        placeholder="Asset name"
        backgroundColor="#F9FAFF"
        type="text"
        autofocus
        className="mb-4"
        value={assetName}
        name="assetName"
        onChange={(e) => setAssetName(e.target.value)}
      />

      <MoneyInput
        placeholder="Value"
        required
        value={value}
        name="value"
        className="mb-4"
        numDecimals={2}
        onChange={(val) => setValue(val)}
      />

      {error && <p className="mb-6 leading-5 text-left text-red">{error}</p>}

      <Button type="submit" disabled={loading}>
        {canAdd
          ? `Add ${assetName} worth ${formatMoneyFromNumber(value)}`
          : 'Add Custom Asset'}
      </Button>
    </form>
  );
};

export default AddCustomAssetForm;
