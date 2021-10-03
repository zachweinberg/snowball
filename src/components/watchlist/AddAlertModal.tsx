import { ExclamationCircleIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import Modal from '~/components/ui/Modal';
import Button from '../ui/Button';
import MoneyInput from '../ui/MoneyInput';

interface Props {
  open: boolean;
  onClose: () => void;
}

const AddAlertModal: React.FunctionComponent<Props> = ({ open, onClose }: Props) => {
  const [condition, setCondition] = useState<string>('Above');
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    // API.getQuote()
  }, []);

  return (
    <Modal isOpen={open} onClose={onClose}>
      <div className="mx-auto w-80">
        <div className="flex justify-center mb-3">
          <ExclamationCircleIcon className="w-9 h-9 text-evergreen" />
        </div>
        <p className="text-[1.25rem] font-bold text-center text-dark mb-11">
          Create a price alert
        </p>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {['Above', 'Below'].map((c) => (
            <button
              key={c}
              onClick={() => setCondition(c)}
              className={classNames(
                'p-4 border-2 cursor-pointer rounded-2xl font-medium',
                condition === c
                  ? 'text-evergreen border-evergreen'
                  : 'text-darkgray border-gray hover:text-evergreen hover:border-evergreen transition-colors'
              )}
            >
              Price Below
            </button>
          ))}
        </div>

        <div className="mb-5">
          <MoneyInput
            name="price"
            className="w-full"
            placeholder="Price"
            value={price}
            onChange={(num) => setPrice(num)}
          />
        </div>

        <div className="flex items-center justify-start mb-5">
          <input
            type="checkbox"
            className="w-5 h-5 mr-3 border rounded cursor-pointer border-purple2 text-blue1 focus:ring-blue2"
            // checked={formik.values.thirdPartyData}
            // onChange={(e) => formik.setFieldValue('thirdPartyData', e.target.checked)}
          />
          <span className="text-dark">Repeat alert forever</span>
        </div>

        <div className="flex items-center justify-start mb-11">
          <input
            type="checkbox"
            className="w-5 h-5 mr-3 border rounded cursor-pointer border-purple2 text-blue1 focus:ring-blue2"
            // checked={formik.values.thirdPartyData}
            // onChange={(e) => formik.setFieldValue('thirdPartyData', e.target.checked)}
          />
          <span className="text-dark">Repeat alert forever</span>
        </div>

        <Button type="button">Create Alert</Button>
      </div>
    </Modal>
  );
};

export default AddAlertModal;
