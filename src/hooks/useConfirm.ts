import { useState } from 'react';
import { ConfirmProps } from '~/components/modals/ConfirmModal';

interface ConfirmState {
  promise: { resolve: (confirm: boolean) => void } | null;
  opts: { title?: string; description?: string };
}

export interface ConfirmAPI {
  confirmModalProps: ConfirmProps;
  openConfirm: (opts?: ConfirmState['opts']) => Promise<unknown>;
}

export function useConfirm(): ConfirmAPI {
  const [confirmData, setConfirmData] = useState<ConfirmState | null>(null);

  const openConfirm = (opts: ConfirmState['opts'] = {}) => {
    return new Promise((resolve) => {
      setConfirmData({ promise: { resolve }, opts });
    });
  };

  return {
    confirmModalProps: {
      open: !!confirmData?.promise,
      title: confirmData?.opts.title || 'Are you sure?',
      description: confirmData?.opts.description || '',
      onCancel: () => {
        setConfirmData({
          opts: { title: confirmData?.opts.title, description: confirmData?.opts.description },
          promise: null,
        });
        confirmData?.promise?.resolve(false);
      },
      onConfirm: () => {
        setConfirmData({
          opts: { title: confirmData?.opts.title, description: confirmData?.opts.description },
          promise: null,
        });
        confirmData?.promise?.resolve(true);
      },
    },
    openConfirm,
  };
}
