import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '~/components/Button';
import TextInput from '~/components/TextInput';

interface Inputs {
  portfolioName: string;
}

const CreatePortfolioForm: React.FunctionComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => alert(JSON.stringify(data));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="mb-8 text-3xl font-bold tracking-wide text-blue3">Create Portfolio</p>

      <TextInput
        type="text"
        name="portfolioName"
        label="Portfolio Name"
        placeholder="Enter name..."
        required
        register={register}
        error={errors.portfolioName ? 'Portfolio name is required' : undefined}
      />

      <Button type="submit" className="mt-5">
        CREATE
      </Button>
    </form>
  );
};

export default CreatePortfolioForm;
