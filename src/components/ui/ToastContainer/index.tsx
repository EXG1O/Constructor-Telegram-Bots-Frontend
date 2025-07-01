import React, { ReactElement } from 'react';
import { ToastProvider, ToastViewport } from '@radix-ui/react-toast';
import Z_INDEX from 'tokens/z-index';

import cn from 'utils/cn';

import { useToastContainerStore } from './store';

export { createMessageToast } from './components/MessageToast';

function ToastContainer(): ReactElement {
  const toasts = useToastContainerStore((state) => state.toasts);

  return (
    <ToastProvider swipeDirection='right' swipeThreshold={75}>
      <ToastViewport
        hotkey={[]}
        label='Notifications'
        className={cn(
          'fixed',
          Z_INDEX.TOAST_CONTAINER,
          'right-0',
          'bottom-0',
          'flex',
          'flex-col',
          'gap-2',
          'p-2',
          'outline-none',
        )}
      >
        {toasts}
      </ToastViewport>
    </ToastProvider>
  );
}

export default ToastContainer;
