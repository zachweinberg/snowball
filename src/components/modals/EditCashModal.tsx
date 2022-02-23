import { CashPosition } from '@zachweinberg/obsidian-schema';
import { useState } from 'react';
import { API } from '~/lib/api';
import Button from '../ui/Button';
import MoneyInput from '../ui/MoneyInput';
import TextInput from '../ui/TextInput';
import BaseModal from './BaseModal';

interface Props {
  position: CashPosition;
  portfolioID: string;
  open: boolean;
  onClose: (reload: boolean) => void;
}

const EditCashModal = ({ position, portfolioID, onClose, open }: Props) => {
  const [accountName, setAccountName] = useState(position.accountName ?? '');
  const [amount, setAmount] = useState(position.amount ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onEditCash = async () => {
    setLoading(true);
    try {
      await API.editCashInPortfolio({
        portfolioID,
        positionID: position.id,
        accountName,
        amount,
      });
      onClose(true);
    } catch (err) {
      setError(err.response?.data?.error ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal open={open} onOpenChange={() => onClose(false)}>
      <form className="mb-6 p-7" autoComplete="off">
        <p className="text-lg font-semibold text-center mb-7">Edit cash position</p>

        <div className="flex flex-col justify-start mb-6">
          <label className="mb-2 font-medium text-left text-dark" htmlFor="costPerShare">
            Account name
          </label>
          <TextInput
            className="mb-4"
            name="accountName"
            placeholder="Account name"
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />
        </div>

        <div className="flex flex-col justify-start mb-6">
          <label className="mb-2 font-medium text-left text-dark" htmlFor="quantity">
            Amount
          </label>
          <MoneyInput
            placeholder="Amount"
            required
            value={amount}
            backgroundColor="#F9FAFF"
            name="amount"
            onChange={(val) => setAmount(Number(val))}
          />
        </div>

        {error && <p className="mb-6 leading-5 text-left text-red">{error}</p>}

        <div className="flex items-center">
          <Button
            type="button"
            className="mr-2"
            variant="secondary"
            onClick={() => onClose(false)}
          >
            Cancel
          </Button>
          <Button type="button" variant="primary" onClick={onEditCash} disabled={loading}>
            Save
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default EditCashModal;
