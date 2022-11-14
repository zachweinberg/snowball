import {
  AddRealEstateRequest,
  Mortgage,
  RealEstatePropertyType,
} from '@zachweinberg/obsidian-schema';
import { trackGoal } from 'fathom-client';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { API } from '~/lib/api';
import AddressSearch from '../ui/AddressSearch';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import MoneyInput from '../ui/MoneyInput';
import QuantityInput from '../ui/QuantityInput';
import Select from '../ui/Select';
import TextInput from '../ui/TextInput';

interface Props {
  afterAdd: () => void;
  goBack: () => void;
  portfolioID: string;
}

interface State {
  name: string | null;
  propertyType: RealEstatePropertyType;
  placeID: string | null;
  automaticValuation: boolean;
  hasMortgage: boolean;
  propertyValue: number | null;
  apt: string | null;
  mortgage: Mortgage | null;
}

const defaultState: State = {
  name: '',
  propertyType: RealEstatePropertyType.SingleFamily,
  placeID: null,
  apt: null,
  propertyValue: null,
  automaticValuation: true,
  hasMortgage: false,
  mortgage: {
    rate: 3.25,
    monthlyPayment: 1000,
    startDateMs: Date.now(),
    termYears: 30,
  },
};

const AddRealEstateForm: React.FunctionComponent<Props> = ({
  afterAdd,
  portfolioID,
  goBack,
}: Props) => {
  const [state, setState] = useState<State>(defaultState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const onSubmit = async (e) => {
    e.preventDefault();

    if (state.automaticValuation && !state.placeID) {
      setError('Please enter an address or disable automatic valuation.');
      return;
    }
    if (!state.automaticValuation && !state.propertyValue) {
      setError('Please enter a manual property value or enable automatic valuation.');
      return;
    }
    if (!state.placeID && !state.name) {
      setError('Please enter a nickname for the property or enter an address.');
      return;
    }

    setLoading(true);

    try {
      const body: AddRealEstateRequest = {
        portfolioID,
        name: state.name ?? '',
        automaticValuation: state.automaticValuation,
        apt: state.apt,
        placeID: state.placeID,
        propertyType: state.propertyType,
        propertyValue: state.propertyValue,
        mortgage: null,
      };

      if (state.hasMortgage && state.mortgage) {
        body.mortgage = {
          rate: state.mortgage!.rate,
          termYears: state.mortgage!.termYears,
          monthlyPayment: state.mortgage!.monthlyPayment,
          startDateMs: state.mortgage!.startDateMs,
        };
      }

      await API.addRealEstateToPortfolio(body);

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
    if (!state.automaticValuation) {
      setState({ ...state, propertyValue: null });
    }
  }, [state.automaticValuation]);

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
        Add different asset type
      </div>

      <h2 className="mb-3 text-center text-[1.75rem] font-bold">Add Real Estate</h2>

      <p className="text-center mb-10 text-darkgray text-[1rem] font-medium">
        Add a property to your portfolio:
      </p>

      <TextInput
        name="name"
        placeholder="Nickname (optional)"
        type="text"
        value={state.name}
        onChange={(e) => setState({ ...state, name: e.target.value })}
        className="mb-4"
      />

      <div className="mb-4">
        <Select
          onChange={(selected) =>
            setState({ ...state, propertyType: selected as RealEstatePropertyType })
          }
          options={[
            { value: RealEstatePropertyType.SingleFamily, label: 'Single Family Home' },
            { value: RealEstatePropertyType.MultiFamily, label: 'Multi Family Home' },
            { value: RealEstatePropertyType.Condo, label: 'Condo' },
            { value: RealEstatePropertyType.Apartment, label: 'Apartment' },
            { value: RealEstatePropertyType.Commercial, label: 'Commercial' },
            { value: RealEstatePropertyType.Storage, label: 'Storage Facility' },
            { value: RealEstatePropertyType.Other, label: 'Other' },
          ]}
          selected={state.propertyType}
        />
      </div>

      <Checkbox
        name="automaticValuation"
        title="Enable Automatic Estimate"
        className="mb-6"
        onChange={(checked) => setState({ ...state, automaticValuation: checked })}
        checked={state.automaticValuation}
        description="Every week we will update this property value with our own estimate. Uncheck this to enter your own manual property value."
      />

      {!state.automaticValuation ? (
        <div className="mb-4">
          <MoneyInput
            placeholder="Property value"
            required
            value={state.propertyValue}
            disabled={state.automaticValuation}
            backgroundColor="#fff"
            name="propertyValue"
            onChange={(val) => setState({ ...state, propertyValue: Number(val) })}
          />
        </div>
      ) : (
        <div className="mb-6">
          <AddressSearch onSubmit={(placeID) => setState({ ...state, placeID })} />
          <TextInput
            type="text"
            placeholder="Unit (optional)"
            value={state.apt}
            onChange={(e) => setState({ ...state, apt: e.target.value })}
            name="apt"
          />
        </div>
      )}

      <Checkbox
        name="mortgage"
        title="Property Has Mortgage"
        className="mb-6"
        onChange={(checked) => setState({ ...state, hasMortgage: checked })}
        checked={state.hasMortgage}
        description="Do you have a mortgage on this property? We can calculate equity if you provide the details."
      />

      {state.hasMortgage && (
        <>
          <p className="text-center my-3 text-darkgray text-[1rem] font-medium">
            Mortgage Info:
          </p>

          <div className="mb-6">
            <div className="mb-2">
              <label htmlFor="mortgage.monthlyPayment">Monthly Payment</label>
            </div>
            <MoneyInput
              placeholder="Monthly payment (P+I)"
              required
              value={state.mortgage!.monthlyPayment}
              disabled={!state.hasMortgage}
              className="mb-4"
              backgroundColor="#fff"
              name="mortgage.monthlyPayment"
              onChange={(val) =>
                setState({
                  ...state,
                  mortgage: { ...state.mortgage!, monthlyPayment: Number(val) },
                })
              }
            />

            <div className="mb-2">
              <label htmlFor="mortgage.termYears">Mortgage Term</label>
            </div>
            <Select
              className="mb-4"
              onChange={(selected) =>
                setState({
                  ...state,
                  mortgage: { ...state.mortgage!, termYears: Number(selected) },
                })
              }
              options={[
                { value: '5', label: '5 year' },
                { value: '7', label: '7 year' },
                { value: '10', label: '10 year' },
                { value: '15', label: '15 year' },
                { value: '20', label: '20 year' },
                { value: '30', label: '30 year' },
              ]}
              selected={state.mortgage!.termYears.toString()}
            />

            <div className="mb-2">
              <label htmlFor="mortgage.rate">Interest Rate</label>
            </div>
            <QuantityInput
              placeholder="Interest rate (%)"
              required
              value={state.mortgage!.rate}
              backgroundColor="#fff"
              name="mortgage.rate"
              numDecimals={3}
              onChange={(val) =>
                setState({ ...state, mortgage: { ...state.mortgage!, rate: val } })
              }
            />

            <div className="mt-4">
              <div className="mb-4">
                <label htmlFor="startDate">Mortgage Start Date</label>
              </div>
              <input
                className="w-full p-3 border-2 rounded-md border-gray placeholder-darkgray focus:outline-none focus:ring-evergreen focus:border-evergreen"
                type="date"
                name="mortgage.startDate"
                value={DateTime.fromMillis(state.mortgage!.startDateMs).toFormat('yyyy-MM-dd')}
                onChange={(e) => {
                  const ms = DateTime.fromFormat(e.target.value, 'yyyy-MM-dd').toMillis();
                  setState({ ...state, mortgage: { ...state.mortgage!, startDateMs: ms } });
                }}
                min="1900-01-01"
                max="2200-01-01"
              />
            </div>
          </div>
        </>
      )}

      {error && <p className="mb-6 leading-5 text-left text-red">{error}</p>}

      <Button type="submit" disabled={loading} className="mb-48">
        Add Real Estate
      </Button>
    </form>
  );
};

export default AddRealEstateForm;
