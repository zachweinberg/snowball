import React, { useState } from 'react';
import * as yup from 'yup';
import { API } from '~/lib/api';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import TextInput from '../ui/TextInput';

const createPortfolioSchema = yup.object().shape({
  portfolioName: yup
    .string()
    .min(3, 'Portfolio name is too short.')
    .max(25, 'Portfolio name is too long.')
    .required(),
  privatePortfolio: yup.boolean().required('Privacy is required.'),
});

interface Props {
  afterCreate: () => void;
}

const CreatePortfolioForm: React.FunctionComponent<Props> = ({ afterCreate }: Props) => {
  const [portfolioName, setPortfolioName] = useState('');
  const [privatePortfolio, setPrivatePortfolio] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    let isValid = false;

    try {
      await createPortfolioSchema.validate({
        portfolioName,
        privatePortfolio,
      });
      isValid = true;
    } catch (err) {
      setError(err.errors?.[0] ?? '');
    }

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
    <form onSubmit={onSubmit} autoComplete="off">
      <div className="text-center mb-9">
        <h2 className="mb-3 font-bold text-dark text-[1.75rem]">Create new portfolio</h2>
        <h2 className="font-medium text-[1rem] text-darkgray">
          Give your new portfolio a name
        </h2>
      </div>

      <TextInput
        placeholder="Portfolio name"
        className="mb-9"
        type="text"
        name="portfolioName"
        required
        value={portfolioName}
        onChange={(e) => setPortfolioName(e.target.value)}
      />

      <div className="mb-9">
        <Checkbox
          checked={privatePortfolio}
          onChange={(checked) => setPrivatePortfolio(checked)}
          name="public"
          title="Private portfolio"
          description="Uncheck this box if you would like the portfolio to be public. Public portfolios are viewable by anyone with the link. Even if a portfolio is public, only you can modify it."
        />
      </div>

      {error && <p className="mb-4 font-medium text-center text-red">{error}</p>}

      <Button type="submit" disabled={loading}>
        Create portfolio
      </Button>
    </form>
  );
};

export default CreatePortfolioForm;
