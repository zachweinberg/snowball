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
          <svg
            className="w-8 h-8 mb-2 fill-current"
            viewBox="0 0 40 40"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 0C8.96714 0 0 8.96714 0 20C0 31.0329 8.96714 40 20 40C31.0329 40 40 31.0329 40 20C40 8.96714 31.0329 0 20 0ZM20 37.9812C10.0939 37.9812 2.01878 29.9061 2.01878 20C2.01878 10.0939 10.0939 2.01878 20 2.01878C29.9061 2.01878 37.9812 10.0939 37.9812 20C37.9812 29.9061 29.9061 37.9812 20 37.9812Z"
              fill="#141414"
            />
            <path
              d="M21.4085 19.9061L27.2771 14.0376C27.6527 13.662 27.6527 13.0047 27.2771 12.6291C26.9015 12.2535 26.2442 12.2535 25.8686 12.6291L20.0001 18.4976L14.1315 12.6291C13.756 12.2535 13.0987 12.2535 12.7231 12.6291C12.3475 13.0047 12.3475 13.662 12.7231 14.0376L18.5916 19.9061L12.7231 25.7277C12.3475 26.1033 12.3475 26.7606 12.7231 27.1361C12.9109 27.3239 13.1926 27.4178 13.4273 27.4178C13.6621 27.4178 13.9438 27.3239 14.1315 27.1361L20.0001 21.2676L25.8686 27.1361C26.0564 27.3239 26.3381 27.4178 26.5729 27.4178C26.8076 27.4178 27.0893 27.3239 27.2771 27.1361C27.6527 26.7606 27.6527 26.1033 27.2771 25.7277L21.4085 19.9061Z"
              fill="#141414"
            />
          </svg>

          <p className="text-sm">Close</p>
        </div>
      </div>

      {children}
    </ReactModal>
  );
};

export default FullScreenModal;
