import { BellIcon, ExclamationCircleIcon, XIcon } from '@heroicons/react/outline';
import { AlertCondition, AlertDestination, AssetType } from 'schema';
import classNames from 'classnames';
import { trackGoal } from 'fathom-client';
import IsEmail from 'isemail';
import parsePhoneNumber from 'libphonenumber-js';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Select from '~/components/ui/Select';
import TextInputWithResults from '~/components/ui/TextInputWithResults';
import { useAuth } from '~/hooks/useAuth';
import { API } from '~/lib/api';
import BackArrowIcon from '../icons/BackArrowIcon';
import Button from '../ui/Button';
import MoneyInput from '../ui/MoneyInput';
import PhoneInput from '../ui/PhoneInput';
import TextInput from '../ui/TextInput';
import BaseModal from './BaseModal';

interface Props {
  open: boolean;
  onClose: (reload: boolean) => void;
}

const AddAlertModal: React.FunctionComponent<Props> = ({ open, onClose }: Props) => {
  const [condition, setCondition] = useState<AlertCondition>(AlertCondition.Above);
  const [destination, setDestination] = useState<AlertDestination>(AlertDestination.Email);
  const [destinationValue, setDestinationValue] = useState<string>('');
  const [objectID, setObjectID] = useState('');
  const [symbol, setSymbol] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [assetType, setAssetType] = useState<AssetType | null>(null);
  const auth = useAuth();

  const STEP = !assetType ? 1 : assetType && !symbol ? 2 : assetType && symbol ? 3 : 1;

  const addAlert = async () => {
    if (!assetType) {
      return;
    }

    if (price <= 0) {
      toast('Please input a valid price.');
      return;
    }

    if (destination === AlertDestination.Email && !IsEmail.validate(destinationValue)) {
      toast('Please use a valid email.');
      return;
    }

    if (destination === AlertDestination.SMS) {
      const formattedNumber = parsePhoneNumber(destinationValue, 'US');

      if (!formattedNumber || !formattedNumber.isValid()) {
        toast('Please use a valid phone number');
        return;
      }
    }

    try {
      await API.addAlert({
        assetType,
        price,
        symbol,
        objectID,
        condition,
        destination,
        destinationValue,
      });

      trackGoal(assetType === AssetType.Crypto ? 'VMARZXKT' : 'PG4GL82T', 0);
      onClose(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (open) {
      setAssetType(null);
      setSymbol('');
      setPrice(0);
    }
  }, [open]);

  useEffect(() => {
    if (destination === AlertDestination.Email) {
      setDestinationValue(auth.user?.email ?? '');
    } else {
      setDestinationValue('');
    }
  }, [destination]);

  return (
    <BaseModal open={open} onOpenChange={() => onClose(false)}>
      <div className="relative">
        <div onClick={() => onClose(false)} className="absolute top-0 right-0 pt-3 pr-3">
          <XIcon className="w-5 cursor-pointer hover:opacity-70" />
        </div>
        {STEP === 1 && (
          <div className="p-6">
            <div className="flex justify-center mb-4">
              <BellIcon className="w-10 h-10 text-evergreen" />
            </div>

            <p className="text-[1.15rem] font-bold text-center text-dark mb-8 leading-snug">
              Which asset type do you want to create an alert for?
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

        {STEP === 2 && (
          <div className="w-full" style={{ height: '550px' }}>
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <div
                className="cursor-pointer text-gray text-[.95rem] font-semibold w-1/3"
                onClick={() => setAssetType(null)}
              >
                <BackArrowIcon width={27} />
              </div>
              <p className="text-[1.1rem] font-bold text-center text-dark w-1/3">
                Select {assetType}
              </p>
              <div className="w-1/3"></div>
            </div>

            <form autoComplete="off">
              <TextInputWithResults
                withPadding
                autofocus
                placeholder={`Enter ${assetType === AssetType.Stock ? 'ticker' : 'symbol'}`}
                type={assetType!}
                onResult={(symbol, objectID) => {
                  setSymbol(symbol);
                  setObjectID(objectID);
                }}
                onError={(e) => toast(e)}
              />
            </form>
          </div>
        )}

        {STEP === 3 && (
          <div className="p-6">
            <div className="flex justify-center mb-3">
              <ExclamationCircleIcon className="w-9 h-9 text-evergreen" />
            </div>
            <p className="text-[1.25rem] font-bold text-center text-dark mb-6">
              When the price of {symbol} is:
            </p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[AlertCondition.Above, AlertCondition.Below].map((_condition) => (
                <button
                  key={_condition}
                  onClick={() => setCondition(_condition)}
                  className={classNames(
                    'p-4 border-2 cursor-pointer rounded-md font-medium focus:ring-evergreen focus:outline-none',
                    condition === _condition
                      ? 'text-evergreen border-evergreen'
                      : 'text-darkgray border-gray hover:text-darkgray hover:border-darkgray transition-colors'
                  )}
                >
                  {_condition}
                </button>
              ))}
            </div>

            <form className="mb-10" autoComplete="off">
              <MoneyInput
                name="price"
                className="w-full mb-5"
                placeholder="Price"
                value={price}
                backgroundColor="#fff"
                onChange={(num) => setPrice(num)}
                numDecimals={assetType === AssetType.Crypto ? 8 : 2}
              />
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <Select
                    options={[
                      { label: 'Email', value: AlertDestination.Email },
                      { label: 'Text', value: AlertDestination.SMS },
                    ]}
                    selected={destination}
                    onChange={(dest) => setDestination(dest as AlertDestination)}
                  />
                </div>
                {destination === AlertDestination.Email ? (
                  <div className="col-span-2">
                    <TextInput
                      type="email"
                      name="destinationValue"
                      value={destinationValue ?? auth.user?.email ?? ''}
                      placeholder="Enter email"
                      onChange={(e) => setDestinationValue(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="col-span-2">
                    <PhoneInput
                      required
                      name="destinationValue"
                      value={destinationValue}
                      placeholder="Enter phone"
                      onChange={(num) => {
                        setDestinationValue(num);
                      }}
                    />
                  </div>
                )}
              </div>
            </form>

            <Button type="button" onClick={addAlert}>
              Save Alert
            </Button>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default AddAlertModal;
