import classNames from 'classnames';
import { Field } from 'formik';
import CurrencyInput from 'react-currency-input-field';

type Props = {
  label: string;
  name: string;
  placeholder: string;
  className?: string;
};

const MoneyInput: React.FunctionComponent<Props> = ({
  label,
  placeholder,
  name,
  className,
}: Props) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-sm font-bold tracking-widest uppercase text-purple2"
        >
          {label}
        </label>
      )}

      <Field name={name}>
        {({ form }) => (
          <CurrencyInput
            className={classNames(
              'px-3 py-2 rounded-lg border border-purple1 w-full bg-gray2 placeholder-purple1 text-gray10 focus:outline-none focus:ring-blue1 focus:border-blue1',
              className
            )}
            name={name}
            placeholder={placeholder}
            defaultValue={1000}
            prefix="$"
            decimalsLimit={2}
            allowNegativeValue={false}
            step={1}
            value={form.values[name]}
            onValueChange={(value) => {
              form.setFieldValue(name, value);
            }}
          />
        )}
      </Field>
    </div>
  );
};

export default MoneyInput;
