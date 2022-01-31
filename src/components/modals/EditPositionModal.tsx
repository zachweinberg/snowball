import {
  AssetType,
  CashPosition,
  CryptoPosition,
  CustomPosition,
  RealEstatePosition,
  StockPosition,
} from '@zachweinberg/obsidian-schema';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface Props<T> {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  position: T | null;
}

type PossibleTypes =
  | StockPosition
  | CryptoPosition
  | RealEstatePosition
  | CashPosition
  | CustomPosition;

export const EditPositionModal: React.FunctionComponent<Props<PossibleTypes>> = ({
  open,
  position,
  onClose,
  onEdit,
}) => {
  const renderForm = () => {
    if (!position) {
      return null;
    }

    if (position.assetType === AssetType.Stock) {
      return <EditStockForm position={position as StockPosition} />;
    }

    if (position.assetType === AssetType.Crypto) {
      return <EditCryptoForm position={position as CryptoPosition} />;
    }

    if (position.assetType === AssetType.RealEstate) {
      return <EditRealEstateForm position={position as RealEstatePosition} />;
    }

    if (position.assetType === AssetType.Cash) {
      return <EditCashForm position={position as CashPosition} />;
    }

    if (position.assetType === AssetType.Custom) {
      return <EditCustomAssetForm position={position as CustomPosition} />;
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <div className="p-7 w-96">
        {renderForm()}
        <div className="flex items-center">
          <Button type="button" className="mr-2" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="primary" onClick={onEdit}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};
