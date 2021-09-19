import { useState } from 'react';
import * as Yup from 'yup';
import { API } from '~/lib/api';

interface Values {
  portfolioName: string;
}

const validationSchema = Yup.object({
  portfolioName: Yup.string()
    .max(45, 'Must be 45 characters or less')
    .required('Portfolio name is required'),
});

interface Props {
  afterCreate: () => void;
  firstTime?: boolean;
}

const CreatePortfolioForm: React.FunctionComponent<Props> = ({
  afterCreate,
  firstTime,
}: Props) => {
  const [error, setError] = useState<string>('');

  const onSubmit = async (data: Values) => {
    try {
      await API.createPortfolio(data.portfolioName, false);
      afterCreate();
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Could not create portfolio.');
      }
    }
  };

  return null;
};

export default CreatePortfolioForm;
