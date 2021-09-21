import React, { useState } from 'react';
import * as yup from 'yup';
import { API } from '~/lib/api';
import Button from '../ui/Button';
import TextInput from '../ui/TextInput';

const createPortfolioSchema = yup.object().shape({
  portfolioName: yup
    .string()
    .min(2, 'Portfolio name is too short.')
    .max(25, 'Portfolio name is too long.')
    .required(),
});

interface Props {
  afterCreate: () => void;
  firstTime?: boolean;
}

const CreatePortfolioForm: React.FunctionComponent<Props> = ({
  afterCreate,
  firstTime,
}: Props) => {
  const [portfolioName, setPortfolioName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    const isValid = await createPortfolioSchema.isValid({
      portfolioName,
    });

    if (isValid) {
      setLoading(true);
      try {
        setError('');
        await API.createPortfolio(portfolioName, false);
        afterCreate();
      } catch (err) {
        if (err.response?.data?.error) {
          setError(err.response.data.error);
        } else {
          setError('Could not create portfolio.');
        }
        setLoading(false);
      }
    }
  };

  return (
    <form className="text-center" onSubmit={onSubmit} autoComplete="off">
      <h2 className="mb-3 font-bold text-dark text-[1.75rem]">Create new portfolio</h2>
      <h2 className="mb-7 font-medium text-[1rem] text-darkgray">
        Give your new portfolio a name
      </h2>
      <TextInput
        placeholder="Portfolio name"
        className="mb-10"
        type="text"
        name="portfolioName"
        value={portfolioName}
        onChange={(e) => setPortfolioName(e.target.value)}
      />
      {error && <p className="mb-2 text-left text-red">{error}</p>}
      <Button type="submit" disabled={loading}>
        Create portfolio
      </Button>
    </form>
  );
};

export default CreatePortfolioForm;
