import { useState } from 'react';

export const useModal = () => {
  const [open, setOpen] = useState(false);

  const hideModal = () => {
    setOpen(false);
  };

  const openModal = () => {
    setOpen(true);
  };

  return { modalOpen: open, hideModal, openModal };
};
