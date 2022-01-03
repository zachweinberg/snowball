import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface Props {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  assetName: string;
}

export const DeletePositionModal: React.FunctionComponent<Props> = ({
  open,
  onClose,
  onDelete,
  assetName,
}: Props) => {
  return (
    <Modal isOpen={open} onClose={onClose}>
      <div className="p-7">
        {assetName && (
          <p className="mb-4 text-lg font-bold">Remove {assetName} from this portfolio?</p>
        )}
        <div className="flex items-center">
          <Button type="button" className="mr-2" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="danger" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
