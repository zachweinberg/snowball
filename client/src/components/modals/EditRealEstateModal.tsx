import {
  AddRealEstateRequest,
  Mortgage,
  RealEstatePosition,
  RealEstatePropertyType,
} from '@zachweinberg/obsidian-schema';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { formatAddresstoString } from '~/lib/addresses';
import { API } from '~/lib/api';
import Button from '../ui/Button';
import MoneyInput from '../ui/MoneyInput';
import QuantityInput from '../ui/QuantityInput';
import Select from '../ui/Select';
import TextInput from '../ui/TextInput';
import BaseModal from './BaseModal';

interface Props {
  position: RealEstatePosition;
  portfolioID: string;
  open: boolean;
  onClose: (reload: boolean) => void;
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

const EditRealEstateModal: React.FunctionComponent<Props> = ({
  position,
  portfolioID,
  onClose,
  open,
}: Props) => {
  const [state, setState] = useState<State>({
    name: position.name ?? '',
    propertyType: position.propertyType,
    placeID: position.googlePlaceID ?? null,
    automaticValuation: position.automaticValuation ?? false,
    hasMortgage: !!position.mortgage ?? false,
    propertyValue: position.propertyValue,
    apt: position.address?.apt ?? '',
    mortgage: position.mortgage ?? null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onEditRealEstate = async () => {
    setLoading(true);

    if (!state.automaticValuation && !state.propertyValue) {
      alert('Please enter property value.');
      setLoading(false);
      return;
    }

    try {
      const body: Partial<AddRealEstateRequest> & { positionID: string } = {
        portfolioID,
        positionID: position.id,
        name: state.name ?? '',
        propertyType: state.propertyType,
        mortgage: state.mortgage ?? null,
      };

      await API.editRealEstateInPortfolio(body);
      onClose(true);
    } catch (err) {
      setError(err.response?.data?.error ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!state.automaticValuation) {
      setState({ ...state, propertyValue: null });
    }
  }, [state.automaticValuation]);

  return (
    <BaseModal open={open} onOpenChange={() => onClose(false)}>
      <form onSubmit={onEditRealEstate} className="mb-6 p-7" autoComplete="off">
        <h2 className="text-lg font-bold text-center mb-7">
          Edit {position.address ? formatAddresstoString(position.address) : position.name}
        </h2>

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

        {state.hasMortgage && (
          <>
            <p className="text-center my-5 text-darkgray text-[1rem] font-medium">
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
                  <label htmlFor="startDate">Start Date</label>
                </div>
                <input
                  className="w-full p-3 border-2 rounded-md border-gray placeholder-darkgray focus:outline-none focus:ring-evergreen focus:border-evergreen"
                  type="date"
                  name="mortgage.startDate"
                  value={DateTime.fromMillis(state.mortgage!.startDateMs).toFormat(
                    'yyyy-MM-dd'
                  )}
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

        <Button type="button" disabled={loading} variant="primary">
          Edit Real Estate
        </Button>
      </form>
    </BaseModal>
  );
};
export default EditRealEstateModal;
