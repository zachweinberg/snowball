import {
  Address,
  AssetType,
  CashPosition,
  CryptoPosition,
  CustomPosition,
  RealEstatePosition,
  RealEstatePropertyType,
  StockPosition,
} from '@zachweinberg/obsidian-schema';
import { useState } from 'react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import MoneyInput from '../ui/MoneyInput';
import QuantityInput from '../ui/QuantityInput';
import Select from '../ui/Select';
import TextInput from '../ui/TextInput';

interface Props<T> {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  position: T | null;
}

const EditStockForm = ({ position }: { position: StockPosition }) => {
  const [quantity, setQuantity] = useState(position.quantity);
  const [costPerShare, setCostPerShare] = useState(position.costPerShare);

  return (
    <form className="mb-6">
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

      <div className="flex flex-col justify-start">
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
    </form>
  );
};

const EditCryptoForm = ({ position }: { position: CryptoPosition }) => {
  const [quantity, setQuantity] = useState(position.quantity);
  const [costPerCoin, setCostPerCoin] = useState(position.costPerCoin);

  return (
    <form className="mb-6">
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

      <div className="flex flex-col justify-start">
        <label className="mb-2 font-medium text-left text-dark" htmlFor="costPerCoin">
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
    </form>
  );
};

const humanAddress = (address: Address): string => {
  if (address.apt) {
    return `${address.street} APT ${address.apt}, ${address.city} ${address.state}, ${address.zip}`;
  }

  return `${address.street}, ${address.city} ${address.state}, ${address.zip}`;
};

const EditRealEstateForm = ({ position }: { position: RealEstatePosition }) => {
  const [address, setAddress] = useState<Address | null>(position.address ?? null);
  const [propertyType, setPropertyType] = useState(position.propertyType);
  const [propertyValue, setPropertyValue] = useState(position.propertyValue);

  return (
    <form className="mb-6">
      <div className="flex flex-col justify-start mb-6">
        <label className="mb-2 font-medium text-left text-dark" htmlFor="address">
          Address
        </label>

        <TextInput
          className="mb-4"
          name="address"
          placeholder="Address (optional)"
          type="text"
          value={address ? humanAddress(address) : ''}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className="flex flex-col justify-start mb-6">
        <label className="mb-2 font-medium text-left text-dark" htmlFor="propertyType">
          Property Type
        </label>
        <Select
          onChange={(selected) => setPropertyType(selected as RealEstatePropertyType)}
          options={[
            { value: RealEstatePropertyType.SingleFamily, label: 'Single Family Home' },
            { value: RealEstatePropertyType.MultiFamily, label: 'Multi Family Home' },
            { value: RealEstatePropertyType.Condo, label: 'Condo' },
            { value: RealEstatePropertyType.Apartment, label: 'Apartment' },
            { value: RealEstatePropertyType.Commercial, label: 'Commercial' },
            { value: RealEstatePropertyType.Storage, label: 'Storage Facility' },
            { value: RealEstatePropertyType.Other, label: 'Other' },
          ]}
          selected={propertyType}
        />
      </div>

      <div className="flex flex-col justify-start mb-6">
        <label className="mb-2 font-medium text-left text-dark" htmlFor="propertyValue">
          Property Value
        </label>

        <MoneyInput
          placeholder="Property value"
          required
          value={propertyValue}
          backgroundColor="#F9FAFF"
          name="propertyValue"
          onChange={(val) => setPropertyValue(Number(val))}
        />
      </div>
    </form>
  );
};

const EditCashForm = ({ position }: { position: CashPosition }) => {
  const [accountName, setAccountName] = useState(position.accountName ?? '');
  const [amount, setAmount] = useState(position.amount);

  return (
    <form className="mb-6">
      <div className="flex flex-col justify-start mb-6">
        <label className="mb-2 font-medium text-left text-dark" htmlFor="accountName">
          Account name
        </label>
        <TextInput
          placeholder="Account name"
          backgroundColor="#F9FAFF"
          type="text"
          className="mb-4"
          value={accountName}
          autofocus
          name="accountName"
          onChange={(e) => setAccountName(e.target.value)}
        />
      </div>

      <div className="flex flex-col justify-start">
        <label className="mb-2 font-medium text-left text-dark" htmlFor="amount">
          Amount
        </label>
        <MoneyInput
          placeholder="Cash amount"
          required
          value={amount}
          name="amount"
          className="mb-4"
          numDecimals={2}
          onChange={(val) => setAmount(val)}
        />
      </div>
    </form>
  );
};

const EditCustomAssetForm = ({ position }: { position: CustomPosition }) => {
  const [assetName, setAssetName] = useState(position.assetName ?? '');
  const [value, setValue] = useState(position.value);

  return (
    <form className="mb-6">
      <div className="flex flex-col justify-start mb-6">
        <label className="mb-2 font-medium text-left text-dark" htmlFor="accountName">
          Asset name
        </label>
        <TextInput
          placeholder="Asset name"
          backgroundColor="#F9FAFF"
          type="text"
          className="mb-4"
          value={assetName}
          autofocus
          name="assetName"
          onChange={(e) => setAssetName(e.target.value)}
        />
      </div>

      <div className="flex flex-col justify-start">
        <label className="mb-2 font-medium text-left text-dark" htmlFor="amount">
          Value
        </label>
        <MoneyInput
          placeholder="Value"
          required
          value={value}
          name="value"
          className="mb-4"
          numDecimals={2}
          onChange={(val) => setValue(val)}
        />
      </div>
    </form>
  );
};

export const EditPositionModal: React.FunctionComponent<
  Props<StockPosition | CryptoPosition | RealEstatePosition | CashPosition | CustomPosition>
> = ({ open, onClose, onEdit, position }) => {
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
