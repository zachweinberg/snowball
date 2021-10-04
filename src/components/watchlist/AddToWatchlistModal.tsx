import { EyeIcon } from '@heroicons/react/outline';
import { AssetType } from '@zachweinberg/wealth-schema';
import { useEffect, useState } from 'react';
import Modal from '~/components/ui/Modal';
import TextInputWithResults from '~/components/ui/TextInputWithResults';
import Button from '../ui/Button';

interface Props {
  open: boolean;
  onClose: () => void;
}

const AddToWatchlistModal: React.FunctionComponent<Props> = ({ open, onClose }: Props) => {
  const [assetType, setAssetType] = useState<AssetType | null>(null);

  useEffect(() => {
    if (open) {
      setAssetType(null);
    }
  }, [open]);

  return (
    <Modal isOpen={open} onClose={onClose}>
      <div className="relative p-6" style={{ width: '430px' }}>
        {assetType === null && (
          <div className="w-full">
            <div className="flex justify-center mb-8">
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
          <div className="w-full h-96">
            <div className="flex items-center justify-between mb-2">
              <div
                className="cursor-pointer text-gray text-[.95rem] font-semibold w-1/3"
                onClick={() => setAssetType(null)}
              >
                <svg
                  className="fill-current w-7 h-7"
                  viewBox="0 0 25 12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.283852 5.31499C0.284142 5.3147 0.284384 5.31436 0.284724 5.31407L5.34137 0.281805C5.72019 -0.095179 6.33292 -0.0937761 6.71 0.285095C7.08703 0.663918 7.08558 1.27664 6.70676 1.65368L3.31172 5.03226L23.8065 5.03226C24.341 5.03226 24.7742 5.46552 24.7742 6C24.7742 6.53448 24.341 6.96774 23.8065 6.96774L3.31177 6.96774L6.70671 10.3463C7.08554 10.7234 7.08699 11.3361 6.70995 11.7149C6.33287 12.0938 5.7201 12.0951 5.34132 11.7182L0.284674 6.68594C0.284384 6.68565 0.284142 6.68531 0.283805 6.68502C-0.0952124 6.30673 -0.0940032 5.69202 0.283852 5.31499Z"
                    fill="#757784"
                  />
                </svg>
              </div>
              <p className="text-[1.25rem] font-bold text-center text-dark w-1/3">
                Select asset
              </p>
              <div className="w-1/3"></div>
            </div>

            <form autoComplete="off">
              <TextInputWithResults
                placeholder="Enter symbol"
                type={assetType}
                onResult={(a) => console.log(a)}
                onError={(e) => console.error(e)}
              />
            </form>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddToWatchlistModal;
