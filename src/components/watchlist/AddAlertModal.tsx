import { ExclamationCircleIcon, EyeIcon } from '@heroicons/react/outline';
import { AssetType } from '@zachweinberg/obsidian-schema';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import Modal from '~/components/ui/Modal';
import Button from '../ui/Button';
import MoneyInput from '../ui/MoneyInput';

interface Props {
  open: boolean;
  onClose: (reload: boolean) => void;
}

const AddAlertModal: React.FunctionComponent<Props> = ({ open, onClose }: Props) => {
  const [condition, setCondition] = useState<string>('Above');
  const [price, setPrice] = useState<number>(0);
  const [assetType, setAssetType] = useState<AssetType | null>(null);

  useEffect(() => {
    if (open) {
      setAssetType(null);
    }
  }, [open]);

  return (
    <Modal isOpen={open} onClose={() => onClose(false)}>
      <div className="mx-auto w-80 p-6">
        {assetType === null && (
          <div className="w-full">
            <div className="flex justify-center mb-4">
              <EyeIcon className="w-10 h-10 text-evergreen" />
            </div>

            <p className="text-[1.15rem] font-bold text-center text-dark mb-8 leading-snug">
              Which asset type do you want to add to your watchlist?
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Button type="button" onClick={() => setAssetType(AssetType.Stock)}>
                Stock
              </Button>
              <Button type="button" onClick={() => setAssetType(AssetType.Crypto)}>
                Crypto
              </Button>
            </div>
          </div>
        )}

        {assetType !== null && (
          <>
            <div className="flex justify-center mb-3">
              <ExclamationCircleIcon className="w-9 h-9 text-evergreen" />
            </div>
            <p className="text-[1.25rem] font-bold text-center text-dark mb-11">
              Create a price alert
            </p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {['Above', 'Below'].map((c) => (
                <button
                  key={c}
                  onClick={() => setCondition(c)}
                  className={classNames(
                    'p-4 border-2 cursor-pointer rounded-2xl font-medium focus:ring-evergreen focus:outline-none',
                    condition === c
                      ? 'text-evergreen border-evergreen'
                      : 'text-darkgray border-gray hover:text-evergreen hover:border-evergreen transition-colors'
                  )}
                >
                  Price Below
                </button>
              ))}
            </div>

            <div className="mb-5">
              <MoneyInput
                name="price"
                className="w-full"
                placeholder="Price"
                value={price}
                onChange={(num) => setPrice(num)}
              />
            </div>

            <div className="flex items-center justify-start mb-5">
              <input
                type="checkbox"
                className="w-5 h-5 mr-3 border rounded cursor-pointer border-purple2 text-blue1 focus:ring-blue2"
              />
              <span className="text-dark">Fire once and delete alert</span>
            </div>

            <div className="flex items-center justify-start mb-11">
              <input
                type="checkbox"
                className="w-5 h-5 mr-3 border rounded cursor-pointer border-purple2 text-blue1 focus:ring-blue2"
              />
              <span className="text-dark">Repeat alert daily</span>
            </div>

            <Button type="button">Create Alert</Button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default AddAlertModal;
