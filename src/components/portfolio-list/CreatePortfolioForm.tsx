import { trackGoal } from 'fathom-client';
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
  publicPortfolio: yup.boolean().required('Privacy level is required.'),
});

interface Props {
  afterCreate: () => void;
}

const CreatePortfolioForm: React.FunctionComponent<Props> = ({ afterCreate }: Props) => {
  const [portfolioName, setPortfolioName] = useState('');
  const [publicPortfolio, setPublicPortfolio] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    let isValid = false;

    try {
      await createPortfolioSchema.validate({
        portfolioName,
        publicPortfolio,
      });
      isValid = true;
    } catch (err) {
      setError(err.errors?.[0] ?? '');
    }

    if (isValid) {
      setLoading(true);
      try {
        setError('');
        await API.createPortfolio(portfolioName, publicPortfolio);
        trackGoal('YXIP2PHW', 0);
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
        autofocus
        required
        value={portfolioName}
        onChange={(e) => setPortfolioName(e.target.value)}
      />

      <div className="mb-9">
        <Checkbox
          checked={publicPortfolio}
          onChange={(checked) => setPublicPortfolio(checked)}
          name="public"
          title="Make this a public portfolio"
          description="Check this box if you would like the portfolio to be public. The portfolio will be viewable by anyone with the link, however only you can modify it."
        />
      </div>

      {error && <p className="mb-4 leading-5 text-left text-red">{error}</p>}

      <Button type="submit" disabled={loading}>
        Create portfolio
      </Button>
    </form>
  );
};

export default CreatePortfolioForm;
