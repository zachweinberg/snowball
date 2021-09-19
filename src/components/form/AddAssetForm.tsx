import { Transition } from '@headlessui/react';
import { AssetType } from '@zachweinberg/wealth-schema';
import { useState } from 'react';

interface AddAssetFormProps {
  portfolioName: string;
  portfolioID: string;
  onClose: () => void;
}

const availableTypes = [
  { type: AssetType.Stock, label: 'Stock' },
  { type: AssetType.Crypto, label: 'Crypto' },
  { type: AssetType.RealEstate, label: 'Real Estate' },
  { type: AssetType.Cash, label: 'Cash' },
  { type: AssetType.Custom, label: 'Custom Asset' },
];

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

        <div className="grid grid-cols-5 grid-rows-1 gap-7">
          {availableTypes.map((option) => (
            <AssetTypeCard
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
        {/* {renderAssetForm(assetType, portfolioID, onClose)} */}
      </Transition>
    </div>
  );
};

interface AssetTypeCardProps {
  label: string;
  onSelect: () => void;
}

const AssetTypeCard: React.FunctionComponent<AssetTypeCardProps> = ({
  label,
  onSelect,
}: AssetTypeCardProps) => {
  return (
    <div
      onClick={onSelect}
      className="flex flex-col items-center justify-between bg-background rounded-3xl p-14"
    >
      <svg
        width="64"
        height="59"
        viewBox="0 0 64 59"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M64 8.18299L63.9974 0.574738L60.4618 7.31736C60.4277 7.38224 56.9861 13.808 50.75 13.808C43.535 13.808 43.3937 11.933 39.5 11.933C37.4415 11.933 35.9761 12.5572 34.7986 13.0589C33.816 13.4774 33.04 13.808 32 13.808C30.96 13.808 30.184 13.4774 29.2014 13.0589C28.0239 12.5572 26.5584 11.933 24.5 11.933C20.6474 11.933 20.4121 13.808 13.25 13.808C7.01375 13.808 3.57225 7.38224 3.54075 7.32236L0 0.469238V8.18299C0 18.1665 5.0105 23.2417 9.57625 25.7929C6.22662 27.1956 3.75 30.4994 3.75 34.433V36.308H13.25C14.3025 36.308 15.3305 36.1335 16.3006 35.8004C16.3581 36.8972 16.5422 37.9926 16.8555 39.0664C17.8027 42.3136 19.8331 45.0171 22.625 46.7702V53.183C22.625 56.2846 25.1484 58.808 28.25 58.808H35.75C38.8516 58.808 41.375 56.2846 41.375 53.183V46.771C44.1632 45.0222 46.1964 42.3167 47.1445 39.0665C47.4578 37.9927 47.6419 36.8974 47.6994 35.8005C48.6695 36.1336 49.6974 36.3081 50.75 36.3081H60.125V34.4331C60.125 30.5611 57.7653 27.2297 54.4086 25.8015C58.9784 23.253 64 18.1775 64 8.18299ZM4.64437 14.3632C6.75513 16.085 9.62125 17.558 13.25 17.558C16.3696 17.558 18.3919 17.252 19.8769 16.8657C21.1176 19.4474 21.0681 22.4484 19.7281 24.9964C18.1724 24.8551 15.0749 24.3896 12.0386 22.8559C8.33962 20.9874 5.867 18.1426 4.64437 14.3632ZM7.84188 32.558C8.65125 30.3977 10.8013 28.808 13.25 28.8067H17.7186C17.3265 29.6184 17.0138 30.456 16.7816 31.3106C15.7838 32.1179 14.5479 32.558 13.2501 32.558H7.84188ZM35.75 55.058H28.25C27.2161 55.058 26.375 54.2169 26.375 53.183V46.8399C27.4646 46.3667 29.476 45.683 32 45.683C34.5257 45.683 36.5382 46.3677 37.625 46.8394V53.183C37.625 54.2169 36.7839 55.058 35.75 55.058ZM39.4492 43.548C38.0671 42.9082 35.4022 41.9331 32 41.9331C28.5982 41.9331 25.9339 42.9079 24.5515 43.5477C20.3204 40.8306 18.784 35.0576 21.1549 30.3159C22.799 26.8866 24.5125 25.0167 24.5125 20.7831C24.5125 19.043 24.1629 17.343 23.4916 15.7652C23.7981 15.7117 24.1203 15.6831 24.5 15.6831C25.793 15.6831 26.6915 16.0659 27.7318 16.509C28.8861 17.0007 30.1946 17.5581 32 17.5581C33.8054 17.5581 35.1138 17.0007 36.2682 16.509C37.3085 16.0659 38.2071 15.6831 39.5 15.6831C39.8797 15.6831 40.2019 15.7117 40.5084 15.7652C39.837 17.343 39.4874 19.0429 39.4874 20.7831C39.4874 25.0166 41.2011 26.8869 42.8451 30.3157C45.2174 35.0602 43.6777 40.8375 39.4492 43.548ZM56.0537 32.558H50.75C49.4521 32.558 48.2163 32.1179 47.2184 31.3106C46.9861 30.456 46.6735 29.6184 46.2814 28.808H50.75C53.1946 28.808 55.2799 30.3754 56.0537 32.558ZM51.9615 22.8559C48.9242 24.39 45.8257 24.8554 44.272 24.9965C42.9319 22.4485 42.8824 19.4474 44.1231 16.8657C45.6081 17.2519 47.6304 17.558 50.75 17.558C54.3787 17.558 57.2449 16.0849 59.3558 14.3632C58.1329 18.1426 55.6604 20.9874 51.9615 22.8559Z"
          fill="#00565B"
        />
      </svg>
    </div>
  );
};

export default AddAssetForm;
