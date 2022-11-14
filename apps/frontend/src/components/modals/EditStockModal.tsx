import { StockPosition } from 'schema';
import { useState } from 'react';
import { API } from '~/lib/api';
import Button from '../ui/Button';
import MoneyInput from '../ui/MoneyInput';
import QuantityInput from '../ui/QuantityInput';
import BaseModal from './BaseModal';

interface Props {
  position: StockPosition;
  portfolioID: string;
  open: boolean;
  onClose: (reload: boolean) => void;
}

const EditStockModal = ({ position, portfolioID, onClose, open }: Props) => {
  const [quantity, setQuantity] = useState(position.quantity);
  const [costPerShare, setCostPerShare] = useState(position.costPerShare);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onEditStock = async () => {
    setLoading(true);
    try {
      await API.editStockInPortfolio({
        portfolioID,
        positionID: position.id,
        quantity,
        costPerShare,
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
            Cost per share
          </label>
          <MoneyInput
            placeholder="Cost per share"
            required
            value={costPerShare}
            name="costPerShare"
            onChange={(val) => setCostPerShare(val)}
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
          <Button type="button" variant="primary" onClick={onEditStock} disabled={loading}>
            Save
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default EditStockModal;
