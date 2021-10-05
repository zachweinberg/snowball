import { Transition } from '@headlessui/react';
import { AssetType } from '@zachweinberg/wealth-schema';
import { useState } from 'react';
import AddCashForm from './AddCashForm';
import AddCryptoForm from './AddCryptoForm';
import AddCustomAssetForm from './AddCustomAssetForm';
import AddStockForm from './AddStockForm';

interface AddAssetFormProps {
  portfolioName: string;
  portfolioID: string;
  onClose: () => void;
}

const availableTypes = [
  {
    type: AssetType.Stock,
    label: 'Stock',
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="fill-current text-evergreen w-14 h-14"
        viewBox="0 0 24 24"
      >
        <path d="M10 8h-5v-1h5v1zm0 1h-5v1h5v-1zm0 2h-5v1h5v-1zm-2 2h-3v1h3v-1zm10.692-3.939c-.628-.436-.544-.327-.782-1.034-.099-.295-.384-.496-.705-.496h-.003c-.773.003-.64.044-1.265-.394-.129-.092-.283-.137-.437-.137s-.308.045-.438.137c-.629.442-.492.397-1.265.394h-.003c-.321 0-.606.201-.705.496-.238.71-.156.6-.781 1.034-.198.137-.308.353-.308.578l.037.222c.242.708.242.572 0 1.278l-.037.222c0 .224.11.441.309.578.625.434.545.325.781 1.033.099.296.384.495.705.495h.003c.773-.003.64-.044 1.265.394.129.093.283.139.437.139s.308-.046.438-.138c.625-.438.49-.397 1.265-.394h.003c.321 0 .606-.199.705-.495.238-.708.154-.599.782-1.033.197-.137.307-.355.307-.579l-.037-.222c-.242-.709-.24-.573 0-1.278l.037-.222c0-.225-.11-.443-.308-.578zm-3.192 3.189c-.967 0-1.75-.784-1.75-1.75 0-.967.783-1.751 1.75-1.751s1.75.784 1.75 1.751c0 .966-.783 1.75-1.75 1.75zm1.241 2.758l.021-.008h1.238v7l-2.479-1.499-2.521 1.499v-7h1.231c.415.291.69.5 1.269.5.484 0 .931-.203 1.241-.492zm-16.741-13.008v17h11v-2h-9v-13h20v13h-2v2h4v-17h-24z" />
      </svg>
    ),
  },
  {
    type: AssetType.Crypto,
    label: 'Crypto',
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="fill-current text-evergreen w-14 h-14"
        viewBox="0 0 24 24"
      >
        <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 18v-1.511h-.5v1.511h-1v-1.511h-2.484l.25-1.489h.539c.442 0 .695-.425.695-.854v-4.444c0-.416-.242-.702-.683-.702h-.817v-1.5h2.5v-1.5h1v1.5h.5v-1.5h1v1.526c2.158.073 3.012.891 3.257 1.812.29 1.09-.429 2.005-1.046 2.228.75.192 1.789.746 1.789 2.026 0 1.742-1.344 2.908-4 2.908v1.5h-1zm-.5-5.503v2.503c1.984 0 3.344-.188 3.344-1.258 0-1.148-1.469-1.245-3.344-1.245zm0-.997c1.105 0 2.789-.078 2.789-1.25 0-1-1.039-1.25-2.789-1.25v2.5z" />
      </svg>
    ),
  },
  {
    type: AssetType.RealEstate,
    label: 'Real Estate',
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="fill-current text-evergreen w-14 h-14"
        viewBox="0 0 24 24"
      >
        <path d="M20 7.093v-5.093h-3v2.093l3 3zm4 5.907l-12-12-12 12h3v10h7v-5h4v5h7v-10h3zm-5 8h-3v-5h-8v5h-3v-10.26l7-6.912 7 6.99v10.182z" />
      </svg>
    ),
  },
  {
    type: AssetType.Cash,
    label: 'Cash',
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="fill-current text-evergreen w-14 h-14"
        viewBox="0 0 24 24"
      >
        <path d="M12.164 7.165c-1.15.191-1.702 1.233-1.231 2.328.498 1.155 1.921 1.895 3.094 1.603 1.039-.257 1.519-1.252 1.069-2.295-.471-1.095-1.784-1.827-2.932-1.636zm1.484 2.998l.104.229-.219.045-.097-.219c-.226.041-.482.035-.719-.027l-.065-.387c.195.03.438.058.623.02l.125-.041c.221-.109.152-.387-.176-.453-.245-.054-.893-.014-1.135-.552-.136-.304-.035-.621.356-.766l-.108-.239.217-.045.104.229c.159-.026.345-.036.563-.017l.087.383c-.17-.021-.353-.041-.512-.008l-.06.016c-.309.082-.21.375.064.446.453.105.994.139 1.208.612.173.385-.028.648-.36.774zm10.312 1.057l-3.766-8.22c-6.178 4.004-13.007-.318-17.951 4.454l3.765 8.22c5.298-4.492 12.519-.238 17.952-4.454zm-2.803-1.852c-.375.521-.653 1.117-.819 1.741-3.593 1.094-7.891-.201-12.018 1.241-.667-.354-1.503-.576-2.189-.556l-1.135-2.487c.432-.525.772-1.325.918-2.094 3.399-1.226 7.652.155 12.198-1.401.521.346 1.13.597 1.73.721l1.315 2.835zm2.843 5.642c-6.857 3.941-12.399-1.424-19.5 5.99l-4.5-9.97 1.402-1.463 3.807 8.406-.002.007c7.445-5.595 11.195-1.176 18.109-4.563.294.648.565 1.332.684 1.593z" />
      </svg>
    ),
  },
  {
    type: AssetType.Custom,
    label: 'Custom Asset',
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="fill-current text-evergreen w-14 h-14"
        viewBox="0 0 24 24"
      >
        <path d="M18.363 8.464l1.433 1.431-12.67 12.669-7.125 1.436 1.439-7.127 12.665-12.668 1.431 1.431-12.255 12.224-.726 3.584 3.584-.723 12.224-12.257zm-.056-8.464l-2.815 2.817 5.691 5.692 2.817-2.821-5.693-5.688zm-12.318 18.718l11.313-11.316-.705-.707-11.313 11.314.705.709z" />
      </svg>
    ),
  },
];

const AddAssetForm: React.FunctionComponent<AddAssetFormProps> = ({
  portfolioID,
  portfolioName,
  onClose,
}: AddAssetFormProps) => {
  const [assetType, setAssetType] = useState<AssetType | null>(null);

  const renderAssetForm = () => {
    switch (assetType) {
      case AssetType.Stock:
        return (
          <AddStockForm
            afterAdd={onClose}
            portfolioID={portfolioID}
            goBack={() => setAssetType(null)}
          />
        );
      case AssetType.Crypto:
        return (
          <AddCryptoForm
            afterAdd={onClose}
            portfolioID={portfolioID}
            goBack={() => setAssetType(null)}
          />
        );

      // case AssetType.RealEstate:
      //   return <AddRealEstateCrypto afterAdd={onClose} portfolioID={portfolioID} />;
      case AssetType.Cash:
        return (
          <AddCashForm
            afterAdd={onClose}
            portfolioID={portfolioID}
            goBack={() => setAssetType(null)}
          />
        );
      case AssetType.Custom:
        return (
          <AddCustomAssetForm
            afterAdd={onClose}
            portfolioID={portfolioID}
            goBack={() => setAssetType(null)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative max-w-5xl mx-auto mt-20">
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
        <h2 className="mb-3 font-bold text-[1.75rem] text-center">
          Add an asset to {portfolioName}
        </h2>
        <p className="mb-16 font-medium text-darkgray text-[1rem] text-center">
          Select the asset type you would like to add
        </p>

        <div className="grid grid-cols-1 grid-rows-1 md:grid-cols-5 gap-7">
          {availableTypes.map((option) => (
            <AssetTypeCard
              key={option.label}
              label={option.label}
              svg={option.svg}
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
        {renderAssetForm()}
      </Transition>
    </div>
  );
};

interface AssetTypeCardProps {
  label: string;
  onSelect: () => void;
  svg: React.ReactNode;
}

const AssetTypeCard: React.FunctionComponent<AssetTypeCardProps> = ({
  label,
  svg,
  onSelect,
}: AssetTypeCardProps) => {
  return (
    <div
      onClick={onSelect}
      className="flex flex-col items-center justify-center p-4 border-2 border-transparent shadow cursor-pointer bg-background rounded-3xl hover:border-darkgray"
    >
      {svg}
      <span className="mt-5 font-bold text-dark">{label}</span>
    </div>
  );
};

export default AddAssetForm;
