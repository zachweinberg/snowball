import React, { useState } from 'react';
import * as yup from 'yup';
import Typography from '~/components/ui/Typography';
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
    <form className="text-center" onSubmit={onSubmit}>
      <Typography variant="Headline1" element="h2" className="mb-3">
        Create new portfolio
      </Typography>
      <Typography variant="Paragraph" element="h2" className="mb-8 text-darkgray">
        Give your new portfolio a name
      </Typography>
      <TextInput
        placeholder="Portfolio name"
        className="mb-10"
        type="text"
        name="portfolioName"
        value={portfolioName}
        onChange={(e) => setPortfolioName(e.target.value)}
      />
      {error && <p className="mb-2 text-left text-red">{error}</p>}
      <Button type="submit">Create portfolio</Button>
    </form>
  );
};

export default CreatePortfolioForm;
