import { RealEstatePropertyType } from '@zachweinberg/wealth-schema';
import { Form, Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import Button from '~/components/Button';
import MoneyInput from '~/components/form/MoneyInput';
import TextInput from '~/components/form/TextInput';
import { API } from '~/lib/api';
import Select from './Select';

interface Values {
  propertyValue: number;
  propertyType: RealEstatePropertyType;
  estimatedAppreciationRate: number;
  address?: string;
  note?: string;
}

const validationSchema = Yup.object({
  propertyValue: Yup.number()
    .min(0, 'Please enter a larger amount.')
    .max(1000000000, "That's a pretty big number!")
    .required('Property value is required'),
  propertyType: Yup.string()
    .oneOf([
      RealEstatePropertyType.Apartment,
      RealEstatePropertyType.Commercial,
      RealEstatePropertyType.MultiFamily,
      RealEstatePropertyType.SingleFamily,
      RealEstatePropertyType.Storage,
      RealEstatePropertyType.Condo,
      RealEstatePropertyType.Other,
    ])
    .required('Property type is required.'),
  estimatedAppreciationRate: Yup.number().required('Appreciation rate is required.'),
  address: Yup.string().max(100),
  note: Yup.string(),
});

interface Props {
  afterAdd: () => void;
  portfolioID: string;
}

const AddRealEstateCrypto: React.FunctionComponent<Props> = ({
  afterAdd,
  portfolioID,
}: Props) => {
  const [error, setError] = useState<string>('');

  const onSubmit = async (data: Values, actions: FormikHelpers<Values>) => {
    actions.setSubmitting(true);

    try {
      const realEstateData = { ...data, portfolioID };
      await API.addRealEstateToPortfolio(realEstateData);
      afterAdd();
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Could not add real estate.');
      }

      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        estimatedAppreciationRate: 5,
        propertyType: RealEstatePropertyType.SingleFamily,
        propertyValue: 400000,
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <Form className="p-10 bg-white">
          <p className="mb-8 text-3xl font-bold tracking-wide text-blue3">Add Real Estate</p>
          <div className="mb-5">
            <MoneyInput
              label="Property Value"
              name="propertyValue"
              placeholder="Enter number of coins"
            />
          </div>

          <div className="mb-5">
            <Select label="Property Type" name="propertyType">
              <option value="" disabled>
                Select investing experience level
              </option>
              <option value={RealEstatePropertyType.SingleFamily}>Single Family Home</option>
              <option value={RealEstatePropertyType.MultiFamily}>Multi-Family Home</option>
              <option value={RealEstatePropertyType.Condo}>Condo</option>
              <option value={RealEstatePropertyType.Commercial}>Commercial</option>
              <option value={RealEstatePropertyType.Apartment}>Apartment</option>
              <option value={RealEstatePropertyType.Storage}>Storage Facility</option>
              <option value={RealEstatePropertyType.Other}>Other</option>
            </Select>
          </div>

          <div className="mb-5">
            <TextInput
              label="Note"
              name="estimatedAppreciationRate"
              type="number"
              placeholder="Estimated appreciation %"
            />
          </div>

          <div className="mb-5">
            <TextInput
              label="Address"
              name="address"
              type="text"
              placeholder="Optional address"
            />
          </div>

          <div className="mb-5">
            <TextInput label="Note" name="note" type="text" placeholder="Optional note" />
          </div>

          {error && <p className="mb-1 text-sm text-red3">{error}</p>}

          <Button type="submit" className="mt-3" disabled={formik.isSubmitting}>
            Add real estate to portfolio
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default AddRealEstateCrypto;
