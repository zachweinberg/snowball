import { useState } from 'react';
import { ConfirmProps } from '~/components/modals/ConfirmModal';

interface ConfirmState {
  promise: { resolve: (confirm: boolean) => void } | null;
  opts: { description?: string };
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
      description: confirmData?.opts.description || '',
      onCancel: () => {
        setConfirmData({
          opts: { description: confirmData?.opts.description },
          promise: null,
        });
        confirmData?.promise?.resolve(false);
      },
      onConfirm: () => {
        setConfirmData({
          opts: { description: confirmData?.opts.description },
          promise: null,
        });
        confirmData?.promise?.resolve(true);
      },
    },
    openConfirm,
  };
}
