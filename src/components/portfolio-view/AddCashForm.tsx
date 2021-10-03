// import { useState } from 'react';
// import * as Yup from 'yup';
// import Button from '~/components/ui/Button';
// import TextInput from '~/components/ui/TextInput';
// import MoneyInput from './MoneyInput';

// interface Values {
//   accountName: string;
//   amount: number;
//   note?: string;
// }

// const validationSchema = Yup.object({
//   accountName: Yup.string().required('Account name is required.'),
//   amount: Yup.number()
//     .min(0, 'Please enter a larger amount.')
//     .max(1000000000, "That's a pretty big number!")
//     .required('Amount of cash is required.'),
//   note: Yup.string(),
// });

// interface Props {
//   afterAdd: () => void;
//   portfolioID: string;
// }

// const AddCashForm: React.FunctionComponent<Props> = ({ afterAdd, portfolioID }: Props) => {
//   const [error, setError] = useState<string>('');

//   return (
//     <>
//       <p className="mb-8 text-3xl font-bold tracking-wide text-blue3">Add Cash</p>

//       <div className="mb-5">
//         <TextInput
//           label="Cash Account Name"
//           name="accountName"
//           type="text"
//           placeholder="Enter account name"
//         />
//       </div>

//       <div className="mb-5">
//         <MoneyInput label="Cash Amount" name="amount" placeholder="Enter amount" />
//       </div>

//       {error && <p className="mb-1 text-sm text-red3">{error}</p>}

//       <Button type="submit" className="mt-3">
//         Add cash to portfolio
//       </Button>
//     </>
//   );
// };

// export default AddCashForm;

export default () => {};
