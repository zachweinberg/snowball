import classNames from 'classnames';
import { useField } from 'formik';

type Props = {
  label: string;
  name: string;
  className?: string;
};

const Select: React.FunctionComponent<Props> = ({ label, className, ...props }: Props) => {
  const [field, meta] = useField(props);

  return (
    <div>
      {label && (
        <p className="mb-2 text-sm font-bold tracking-widest uppercase text-purple1">
          {label}
        </p>
      )}
      <select
        {...field}
        {...props}
        className={classNames(
          'px-3 py-2 rounded  -lg border border-purple1 w-full bg-gray2 placeholder-purple1 text-gray10 focus:outline-none focus:ring-blue1 focus:border-blue1',
          className
        )}
      ></select>

      {meta.touched && meta.error ? (
        <div className="mt-1 text-sm text-red3">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default Select;
