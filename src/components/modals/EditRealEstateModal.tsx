import { RealEstatePosition, RealEstatePropertyType } from '@zachweinberg/obsidian-schema';
import { useEffect, useState } from 'react';
import { formatAddresstoString } from '~/lib/addresses';
import { API } from '~/lib/api';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import Modal from '../ui/Modal';
import MoneyInput from '../ui/MoneyInput';
import Select from '../ui/Select';
import TextInput from '../ui/TextInput';

interface Props {
  position: RealEstatePosition;
  portfolioID: string;
  open: boolean;
  onClose: (reload: boolean) => void;
}

const EditRealEstateModal = ({ position, portfolioID, onClose, open }: Props) => {
  const [name, setName] = useState(position.name ?? '');
  const [propertyType, setPropertyType] = useState(
    position.propertyType ?? RealEstatePropertyType.SingleFamily
  );
  const [propertyValue, setPropertyValue] = useState<number | null>(
    position.propertyValue ?? null
  );
  const [automaticValuation, setAutomaticValuation] = useState(
    position.automaticValuation ?? false
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (automaticValuation) {
      setPropertyValue(null);
    }
  }, [automaticValuation]);

  const onEditRealEstate = async () => {
    setLoading(true);

    if (!automaticValuation && !propertyValue) {
      alert('Please enter property value.');
      setLoading(false);
      return;
    }
    try {
      const body: any = {
        portfolioID,
        positionID: position.id,
        name,
        propertyType,
        automaticValuation,
        propertyValue,
      };

      if (body.automaticValuation) {
        delete body.propertyValue;
      }

      await API.editRealEstateInPortfolio(body);
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
        <p className="font-semibold leading-6 text-md mb-7">
          Edit {position.address ? formatAddresstoString(position.address) : 'property'}
        </p>

        <div className="flex flex-col justify-start mb-6">
          <label className="mb-2 font-medium text-left text-dark" htmlFor="address">
            Nickname
          </label>

          <TextInput
            className="mb-4"
            name="name"
            placeholder="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

        <div className="mb-6 text-left">
          <Checkbox
            name="automaticEstimate"
            title="Enable Automatic Estimate"
            className="mb-6"
            onChange={(checked) => setAutomaticValuation(checked)}
            checked={automaticValuation}
            description="Every week we will update this property value with our own estimate. Uncheck this to enter your own manual property value."
          />
        </div>

        {!automaticValuation && (
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
        )}

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
          <Button
            type="button"
            variant="primary"
            onClick={onEditRealEstate}
            disabled={loading}
            loading={loading}
          >
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditRealEstateModal;
