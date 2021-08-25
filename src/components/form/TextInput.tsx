import classNames from 'classnames';
import { Field } from 'formik';

type Props = {
  type: 'text' | 'password' | 'email' | 'number';
  label: string;
  name: string;
  placeholder: string;
  className?: string;
};

const TextInput: React.FunctionComponent<Props> = ({
  label,
  className,
  name,
  type,
  placeholder,
}: Props) => {
  return (
    <Field name={name}>
      {({ form, meta }) => (
        <>
          {label && (
            <label
              htmlFor={name}
              className="block mb-2 text-sm font-bold tracking-widest uppercase text-purple1"
            >
              {label}
            </label>
          )}

          <input
            name={name}
            placeholder={placeholder}
            type={type}
            onChange={(e) => {
              form.setFieldValue(
                name,
                type === 'number' ? Number(e.target.value) : e.target.value
              );
            }}
            autoComplete="off"
            className={classNames(
              'px-3 py-2 rounded-lg border border-purple1 w-full bg-gray2 placeholder-purple1 text-gray10 focus:outline-none focus:ring-blue1 focus:border-blue1',
              className
            )}
          />

          {meta.touched && meta.error ? (
            <div className="mt-1 text-sm text-red3">{meta.error}</div>
          ) : null}
        </>
      )}
    </Field>
  );
};

export default TextInput;
