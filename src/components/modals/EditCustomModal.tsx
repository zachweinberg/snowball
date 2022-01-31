import { CustomPosition } from '@zachweinberg/obsidian-schema';
import { useState } from 'react';
import { API } from '~/lib/api';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import MoneyInput from '../ui/MoneyInput';
import TextInput from '../ui/TextInput';

interface Props {
  position: CustomPosition;
  portfolioID: string;
  open: boolean;
  onClose: (reload: boolean) => void;
}

const EditCustomModal = ({ position, portfolioID, onClose, open }: Props) => {
  const [assetName, setAssetName] = useState(position.assetName ?? '');
  const [value, setValue] = useState(position.value ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onEditCustom = async () => {
    setLoading(true);
    try {
      await API.editCustomInPortfolio({
        portfolioID,
        positionID: position.id,
        value,
        assetName,
      });
      onClose(true);
    } catch (err) {
      setError(err.response?.data?.error ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={() => onClose(false)}>
      <form className="mb-6 p-7 w-96">
        <p className="text-lg font-semibold mb-7">Edit custom asset</p>

        <div className="flex flex-col justify-start mb-6">
          <label className="mb-2 font-medium text-left text-dark" htmlFor="costPerShare">
            Asset name
          </label>
          <TextInput
            className="mb-4"
            name="assetName"
            placeholder="Asset name"
            type="text"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
          />
        </div>

        <div className="flex flex-col justify-start mb-6">
          <label className="mb-2 font-medium text-left text-dark" htmlFor="quantity">
            Value
          </label>
          <MoneyInput
            placeholder="Value"
            required
            value={value}
            backgroundColor="#F9FAFF"
            name="value"
            onChange={(val) => setValue(Number(val))}
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
          <Button type="button" variant="primary" onClick={onEditCustom} disabled={loading}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditCustomModal;
