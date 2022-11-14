import { Content, Overlay, Portal, Root } from '@radix-ui/react-alert-dialog';
import React from 'react';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const BaseModal: React.FunctionComponent<ModalProps> = (props: ModalProps) => {
  const { open, children, onOpenChange } = props;

  return (
    <Root open={open} onOpenChange={onOpenChange}>
      <Portal>
        <Overlay className="fixed inset-0 w-full h-full text-center align-middle select-none p-96 modal-overlay" />
        <Content className="fixed inset-0 flex flex-col items-center justify-center w-full h-full modal-contentWrapper">
          <div className="w-full max-w-md bg-white rounded-md">{children}</div>
        </Content>
      </Portal>
    </Root>
  );
};

export default BaseModal;
