import { CryptoPosition } from '@zachweinberg/obsidian-schema';
import { useState } from 'react';
import { API } from '~/lib/api';
import Button from '../ui/Button';
import MoneyInput from '../ui/MoneyInput';
import QuantityInput from '../ui/QuantityInput';
import BaseModal from './BaseModal';

interface Props {
  position: CryptoPosition;
  portfolioID: string;
  open: boolean;
  onClose: (reload: boolean) => void;
}

const EditCryptoModal = ({ position, portfolioID, onClose, open }: Props) => {
  const [quantity, setQuantity] = useState(position.quantity);
  const [costPerCoin, setCostPerCoin] = useState(position.costPerCoin);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onEditCrypto = async () => {
    setLoading(true);
    try {
      await API.editCryptoInPortfolio({
        portfolioID,
        positionID: position.id,
        quantity,
        costPerCoin,
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
        <p className="text-lg font-semibold text-center mb-7">Edit {position.symbol}</p>
        <div className="flex flex-col justify-start mb-6">
          <label className="mb-2 font-medium text-left text-dark" htmlFor="quantity">
            Quantity
          </label>
          <QuantityInput
            placeholder="Quantity"
            required
            value={quantity}
            backgroundColor="#F9FAFF"
            name="quantity"
            onChange={(val) => setQuantity(Number(val))}
          />
        </div>

        <div className="flex flex-col justify-start mb-6">
          <label className="mb-2 font-medium text-left text-dark" htmlFor="costPerShare">
            Cost per coin
          </label>
          <MoneyInput
            placeholder="Cost per coin"
            required
            value={costPerCoin}
            name="costPerCoin"
            onChange={(val) => setCostPerCoin(val)}
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
          <Button type="button" variant="primary" onClick={onEditCrypto} disabled={loading}>
            Save
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default EditCryptoModal;
