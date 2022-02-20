import { Content, Overlay, Portal, Root } from '@radix-ui/react-alert-dialog';
import React from 'react';

export interface ModalProps {
  open: boolean;
  toggle: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  children: React.ReactNode;
}

const BaseModal: React.FunctionComponent<ModalProps> = (props: ModalProps) => {
  const { open, toggle, onCancel, onConfirm, children } = props;

  return (
    <Root open={open} onOpenChange={toggle}>
      <Portal>
        <Overlay className="fixed inset-0 w-full h-full p-10 text-center select-none align-middl modal-overlay" />
        <Content className="fixed inset-0 flex flex-col items-center justify-center w-full h-full p-10 modal-contentWrapper">
          <div className="w-full max-w-md p-10 bg-white rounded-sm">
            <div className="p-3 my-2 -mx-2 text-right rounded-sm bg-gray">{children}</div>
          </div>
        </Content>
      </Portal>
    </Root>
  );
};

export default BaseModal;
