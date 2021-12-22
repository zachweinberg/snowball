import { BellIcon, ExclamationCircleIcon } from '@heroicons/react/outline';
import { AlertCondition, AlertDestination, AssetType } from '@zachweinberg/obsidian-schema';
import classNames from 'classnames';
import IsEmail from 'isemail';
import parsePhoneNumber from 'libphonenumber-js';
import { useEffect, useState } from 'react';
import Modal from '~/components/ui/Modal';
import Select from '~/components/ui/Select';
import TextInputWithResults from '~/components/ui/TextInputWithResults';
import { API } from '~/lib/api';
import Button from '../ui/Button';
import MoneyInput from '../ui/MoneyInput';
import PhoneInput from '../ui/PhoneInput';
import TextInput from '../ui/TextInput';

interface Props {
  open: boolean;
  onClose: (reload: boolean) => void;
}

const AddAlertModal: React.FunctionComponent<Props> = ({ open, onClose }: Props) => {
  const [condition, setCondition] = useState<AlertCondition>(AlertCondition.Above);
  const [destination, setDestination] = useState<AlertDestination>(AlertDestination.Email);
  const [destinationValue, setDestinationValue] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [assetType, setAssetType] = useState<AssetType | null>(null);

  const STEP = !assetType ? 1 : assetType && !symbol ? 2 : assetType && symbol ? 3 : 1;

  const addAlert = async () => {
    if (!assetType) {
      return;
    }

    if (price < 0) {
      alert('Please input a valid price.');
      return;
    }

    if (destination === AlertDestination.Email && !IsEmail.validate(destinationValue)) {
      alert('Please use a valid email.');
      return;
    }

    if (destination === AlertDestination.SMS) {
      const formattedNumber = parsePhoneNumber(destinationValue, 'US');

      if (!formattedNumber || !formattedNumber.isValid()) {
        alert('Please use a valid phone number');
        return;
      }
    }

    await API.addAlert({
      assetType,
      price,
      symbol,
      condition,
      destination,
      destinationValue,
    });

    onClose(true);
  };

  useEffect(() => {
    if (open) {
      setAssetType(null);
      setSymbol('');
      setPrice(0);
    }
  }, [open]);

  useEffect(() => {
    setDestinationValue('');
  }, [destination]);

  return (
    <Modal isOpen={open} onClose={() => onClose(false)}>
      <div className="relative" style={{ width: '480px' }}>
        {STEP === 1 && (
          <div className="w-full p-6">
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
                <svg
                  className="fill-current w-7 h-7"
                  viewBox="0 0 25 12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.283852 5.31499C0.284142 5.3147 0.284384 5.31436 0.284724 5.31407L5.34137 0.281805C5.72019 -0.095179 6.33292 -0.0937761 6.71 0.285095C7.08703 0.663918 7.08558 1.27664 6.70676 1.65368L3.31172 5.03226L23.8065 5.03226C24.341 5.03226 24.7742 5.46552 24.7742 6C24.7742 6.53448 24.341 6.96774 23.8065 6.96774L3.31177 6.96774L6.70671 10.3463C7.08554 10.7234 7.08699 11.3361 6.70995 11.7149C6.33287 12.0938 5.7201 12.0951 5.34132 11.7182L0.284674 6.68594C0.284384 6.68565 0.284142 6.68531 0.283805 6.68502C-0.0952124 6.30673 -0.0940032 5.69202 0.283852 5.31499Z"
                    fill="#757784"
                  />
                </svg>
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
                onResult={(symbol) => setSymbol(symbol)}
                onError={(e) => alert(e)}
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
                    'p-4 border-2 cursor-pointer rounded-2xl font-medium focus:ring-evergreen focus:outline-none',
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
                onChange={(num) => setPrice(num)}
                numDecimals={assetType === AssetType.Crypto ? 8 : 2}
              />
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <Select
                    options={[
                      { label: 'Email me', value: AlertDestination.Email },
                      { label: 'Text me', value: AlertDestination.SMS },
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
                      value={destinationValue}
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
              Create Alert
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddAlertModal;
