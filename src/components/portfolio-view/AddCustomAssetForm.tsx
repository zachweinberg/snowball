// import currency from 'currency.js';
// import { Form, Formik, FormikHelpers } from 'formik';
// import { useState } from 'react';
// import * as Yup from 'yup';
// import Button from '~/components/ui/Button';
// import TextInput from '~/components/ui/TextInput';
// import { API } from '~/lib/api';
// import MoneyInput from './MoneyInput';

// interface Values {
//   assetName: string;
//   value: number;
//   note?: string;
// }

// const validationSchema = Yup.object({
//   assetName: Yup.string().required('Asset name is required.'),
//   value: Yup.number()
//     .min(0, 'Please enter a larger amount.')
//     .max(10000000000, "That's a pretty big number!")
//     .required('Asset value is required.'),
//   note: Yup.string(),
// });

// interface Props {
//   afterAdd: () => void;
//   portfolioID: string;
// }

// const AddCustomAssetForm: React.FunctionComponent<Props> = ({
//   afterAdd,
//   portfolioID,
// }: Props) => {
//   const [error, setError] = useState<string>('');

//   const onSubmit = async (data: Values, actions: FormikHelpers<Values>) => {
//     actions.setSubmitting(true);

//     const numberValue = currency(data.value).value;

//     try {
//       const coinData = { ...data, value: numberValue, portfolioID };
//       await API.addCustomAssetToPortfolio(coinData);
//       afterAdd();
//     } catch (err) {
//       if (err.response?.data?.error) {
//         setError(err.response.data.error);
//       } else {
//         setError('Could not add custom asset.');
//       }

//       actions.setSubmitting(false);
//     }
//   };

//   return (
//     <Formik
//       initialValues={{
//         value: 0,
//         assetName: '',
//       }}
//       validationSchema={validationSchema}
//       onSubmit={onSubmit}
//     >
//       {(formik) => (
//         <Form className="bg-white">
//           <p className="mb-8 text-3xl font-bold tracking-wide text-blue3">Add Custom Asset</p>

//           <div className="mb-5">
//             <TextInput
//               label="Asset Name"
//               name="assetName"
//               type="text"
//               placeholder="Enter asset name"
//             />
//           </div>

//           <div className="mb-5">
//             <MoneyInput label="Asset Value" name="value" placeholder="Enter amount" />
//           </div>

//           <div className="mb-5">
//             <TextInput label="Note" name="note" type="text" placeholder="Optional note" />
//           </div>

//           {error && <p className="mb-1 text-sm text-red3">{error}</p>}

//           <Button type="submit" className="mt-3" disabled={formik.isSubmitting}>
//             Add asset to portfolio
//           </Button>
//         </Form>
//       )}
//     </Formik>
//   );
// };

// export default AddCustomAssetForm;

export default () => {};
