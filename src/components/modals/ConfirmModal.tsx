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

  return (
    <BaseModal open={open} onCancel={onCancel} onConfirm={onConfirm}>
      <p>{title}</p>
      <p>{description}</p>
      <button onClick={onCancel}>Cancel</button>
    </BaseModal>
  );
};

export default ConfirmModal;
