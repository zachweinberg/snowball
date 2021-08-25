import { Transition } from '@headlessui/react';
import { ArrowRightIcon } from '@heroicons/react/solid';
import { AssetType } from '@zachweinberg/wealth-schema';
import { useState } from 'react';
import AddStockForm from '~/components/form/AddStockForm';
import AddCashForm from './AddCashForm';
import AddCryptoForm from './AddCryptoForm';
import AddCustomAssetForm from './AddCustomAssetForm';
import AddRealEstateCrypto from './AddRealEstateForm';

const availableTypes = [
  { type: AssetType.Stock, label: 'Stock' },
  { type: AssetType.Crypto, label: 'Crypto' },
  { type: AssetType.RealEstate, label: 'Real Estate' },
  { type: AssetType.Cash, label: 'Cash' },
  { type: AssetType.Custom, label: 'Custom Asset' },
];

interface AssetTypeRowProps {
  label: string;
  onSelect: () => void;
}

interface AddAssetFormProps {
  portfolioName: string;
  portfolioID: string;
  onClose: () => void;
}

const AssetTypeRow: React.FunctionComponent<AssetTypeRowProps> = ({
  label,
  onSelect,
}: AssetTypeRowProps) => {
  return (
    <div
      onClick={onSelect}
      className="flex items-center justify-between px-2 py-3 font-bold transition-colors border rounded-md cursor-pointer border-purple1 text-md hover:bg-gray7"
    >
      <p className="pl-1">{label}</p>
      <ArrowRightIcon className="w-5 h-5" />
    </div>
  );
};

const renderAssetForm = (assetType: AssetType | null, portfolioID, onClose: () => void) => {
  switch (assetType) {
    case AssetType.Stock:
      return <AddStockForm afterAdd={onClose} portfolioID={portfolioID} />;
    case AssetType.Crypto:
      return <AddCryptoForm afterAdd={onClose} portfolioID={portfolioID} />;
    case AssetType.RealEstate:
      return <AddRealEstateCrypto afterAdd={onClose} portfolioID={portfolioID} />;
    case AssetType.Cash:
      return <AddCashForm afterAdd={onClose} portfolioID={portfolioID} />;
    case AssetType.Custom:
      return <AddCustomAssetForm afterAdd={onClose} portfolioID={portfolioID} />;
    default:
      return null;
  }
};

const AddAssetForm: React.FunctionComponent<AddAssetFormProps> = ({
  portfolioID,
  portfolioName,
  onClose,
}: AddAssetFormProps) => {
  const [assetType, setAssetType] = useState<AssetType | null>(null);

  return (
    <div className="relative w-full">
      <Transition
        className="absolute w-full"
        show={assetType === null}
        enter="transition-all duration-300"
        enterFrom="-translate-x-24 opacity-0"
        enterTo="translate-x-0 opacity-100"
        leave="transition-all duration-300"
        leaveFrom="translate-x-0 opacity-100"
        leaveTo="-translate-x-24 opacity-0"
      >
        <p className="mb-2 text-3xl font-semibold tracking-wide text-blue3">
          Add an asset to {portfolioName}
        </p>

        <p className="mb-5 text-lg text-purple2">
          Select the asset type you would like to add:
        </p>

        <div className="flex flex-col space-y-4 text-purple2">
          {availableTypes.map((option) => (
            <AssetTypeRow
              key={option.label}
              label={option.label}
              onSelect={() => setAssetType(option.type)}
            />
          ))}
        </div>
      </Transition>

      <Transition
        className="absolute w-full"
        show={assetType !== null}
        enter="transition-all duration-300"
        enterFrom="translate-x-24 opacity-0"
        enterTo="translate-x-0 opacity-100"
        leave="transition-all duration-300"
        leaveFrom="translate-x-0 opacity-100"
        leaveTo="translate-x-24 opacity-0"
      >
        {renderAssetForm(assetType, portfolioID, onClose)}
      </Transition>
    </div>
  );
};

export default AddAssetForm;
