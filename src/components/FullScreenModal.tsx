import { XIcon } from '@heroicons/react/outline';
import { useEffect } from 'react';
import ReactModal from 'react-modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const FullScreenModal: React.FunctionComponent<Props> = ({
  isOpen,
  onClose,
  children,
}: Props) => {
  useEffect(() => {
    ReactModal.setAppElement('#root');
  }, []);

  return (
    <ReactModal
      isOpen={isOpen}
      style={{
        overlay: {
          backgroundColor: '#fff',
        },
        content: {
          border: 'none',
          height: '100vh',
          width: '100vw',
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      }}
      onRequestClose={onClose}
      contentLabel="Modal"
      closeTimeoutMS={200}
      shouldFocusAfterRender={true}
      shouldCloseOnEsc={true}
      shouldReturnFocusAfterClose={true}
      preventScroll={false}
    >
      <div className="flex justify-end">
        <div
          className="flex flex-col items-center cursor-pointer hover:opacity-60"
          onClick={onClose}
        >
          <XIcon className="text-gray10 h-7 w-7" />
          <p className="text-sm">Close</p>
        </div>
      </div>

      {children}
    </ReactModal>
  );
};

export default FullScreenModal;
