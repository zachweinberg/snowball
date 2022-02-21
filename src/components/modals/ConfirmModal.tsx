import classNames from 'classnames';
import BaseModal from './BaseModal';

export interface ConfirmProps {
  open: boolean;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const Btn = (props) => {
  return (
    <button
      onClick={props.onClick}
      className={classNames(
        'px-4 py-3 font-semibold text-white transition-colors duration-150 rounded-md hover:bg-opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-evergreen focus:outline-none',
        props.red ? 'bg-red' : 'bg-dark',
        props.className
      )}
    >
      {props.children}
    </button>
  );
};

const ConfirmModal: React.FunctionComponent<ConfirmProps> = (props: ConfirmProps) => {
  const { open, description, onCancel, onConfirm } = props;

  const onToggle = (open: boolean) => {
    if (!open) {
      onCancel();
      return;
    }
  };

  return (
    <BaseModal open={open} onOpenChange={onToggle}>
      <div className="p-5">
        {<p className="mb-3 font-semibold leading-5 text-md">Confirm</p>}
        {description && <p className="mb-5 font-medium leading-5 text-md">{description}</p>}
        <div className="flex justify-end">
          <Btn red onClick={onCancel} className="mr-3">
            Cancel
          </Btn>

          <Btn onClick={onConfirm}>Confirm</Btn>
        </div>
      </div>
    </BaseModal>
  );
};

export default ConfirmModal;
