import BaseModal from './BaseModal';

export interface ConfirmProps {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmModal: React.FunctionComponent<ConfirmProps> = (props: ConfirmProps) => {
  const { open, title, description, onCancel, onConfirm } = props;

  const toggle = (open: boolean) => {
    if (!open) {
      onCancel();
      return;
    }
  };

  return (
    <BaseModal open={open} onOpenChange={toggle}>
      <p>{title}</p>
      {description && <p>{description}</p>}
      <button onClick={onCancel}>Cancel</button>
      <button onClick={onConfirm}>Confirm</button>
    </BaseModal>
  );
};

export default ConfirmModal;
