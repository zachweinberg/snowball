import { RealEstatePropertyType } from '@zachweinberg/obsidian-schema';
import { trackGoal } from 'fathom-client';
import { useEffect, useState } from 'react';
import { API } from '~/lib/api';
import AddressSearch from '../ui/AddressSearch';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import MoneyInput from '../ui/MoneyInput';
import Select from '../ui/Select';
import TextInput from '../ui/TextInput';

interface Props {
  afterAdd: () => void;
  goBack: () => void;
  portfolioID: string;
}

const AddRealEstateForm: React.FunctionComponent<Props> = ({
  afterAdd,
  portfolioID,
  goBack,
}: Props) => {
  const [propertyType, setPropertyType] = useState<RealEstatePropertyType>(
    RealEstatePropertyType.SingleFamily
  );
  const [name, setName] = useState<string>('');
  const [propertyValue, setPropertyValue] = useState<number | null>(null);
  const [automaticValuation, setAutomaticValuation] = useState<boolean>(true);
  const [placeID, setPlaceID] = useState<string | null>('');
  const [apt, setApt] = useState<string | null>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      setError('Name is required.');
      return;
    }

    if (automaticValuation && !placeID) {
      setError('Please select an address.');
      return;
    }

    if (!automaticValuation && !propertyValue) {
      setError('Please enter a manual property value.');
      return;
    }

    setLoading(true);

    try {
      await API.addRealEstateToPortfolio({
        name,
        automaticValuation,
        apt,
        placeID,
        portfolioID,
        propertyType,
        propertyValue,
      });

      trackGoal('GQQC3TA8', 0);

      afterAdd();
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Could not add property.');
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    if (!automaticValuation) {
      setPropertyValue(null);
    }
  }, [automaticValuation]);

  return (
    <form onSubmit={onSubmit} className="flex flex-col max-w-lg mx-auto" autoComplete="off">
      <div
        className="flex items-center justify-center mb-10 cursor-pointer text-darkgray text-[.95rem] font-semibold"
        onClick={goBack}
      >
        <svg
          className="w-5 h-5 mr-2 fill-current"
          viewBox="0 0 25 12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.283852 5.31499C0.284142 5.3147 0.284384 5.31436 0.284724 5.31407L5.34137 0.281805C5.72019 -0.095179 6.33292 -0.0937761 6.71 0.285095C7.08703 0.663918 7.08558 1.27664 6.70676 1.65368L3.31172 5.03226L23.8065 5.03226C24.341 5.03226 24.7742 5.46552 24.7742 6C24.7742 6.53448 24.341 6.96774 23.8065 6.96774L3.31177 6.96774L6.70671 10.3463C7.08554 10.7234 7.08699 11.3361 6.70995 11.7149C6.33287 12.0938 5.7201 12.0951 5.34132 11.7182L0.284674 6.68594C0.284384 6.68565 0.284142 6.68531 0.283805 6.68502C-0.0952124 6.30673 -0.0940032 5.69202 0.283852 5.31499Z"
            fill="#757784"
          />
        </svg>
        Back
      </div>

      <h2 className="mb-3 text-center text-[1.75rem] font-bold">Add Real Estate</h2>

      <p className="text-center mb-10 text-darkgray text-[1rem] font-medium">
        Add a property to your portfolio.
      </p>

      <TextInput
        name="name"
        placeholder="Nickname (optional)"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4"
      />

      <div className="mb-4">
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

      <Checkbox
        name="automaticEstimate"
        title="Enable Automatic Estimate"
        className="mb-6"
        onChange={(checked) => setAutomaticValuation(checked)}
        checked={automaticValuation}
        description="Every week we will update this property value with our own estimate. Uncheck this to enter your own manual property value."
      />

      {!automaticValuation ? (
        <div className="mb-4">
          <MoneyInput
            placeholder="Property value"
            required
            value={propertyValue}
            disabled={automaticValuation}
            backgroundColor="#fff"
            name="propertyValue"
            onChange={(val) => setPropertyValue(Number(val))}
          />
        </div>
      ) : (
        <div className="mb-4">
          <AddressSearch onSubmit={(placeID) => setPlaceID(placeID)} />
          <TextInput
            type="text"
            placeholder="Unit (optional)"
            value={apt}
            onChange={(e) => setApt(e.target.value)}
            name="apt"
          />
        </div>
      )}

      {error && <p className="mb-6 leading-5 text-left text-red">{error}</p>}

      <Button type="submit" disabled={loading}>
        Add Real Estate
      </Button>
    </form>
  );
};

export default AddRealEstateForm;
