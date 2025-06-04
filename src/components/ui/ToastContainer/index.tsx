import React, { ReactElement } from 'react';
import { ToastProvider, ToastViewport } from '@radix-ui/react-toast';

import { useToastContainerStore } from './store';

export { createMessageToast } from './components/MessageToast';

function ToastContainer(): ReactElement {
  const toasts = useToastContainerStore((state) => state.toasts);

  return (
    <ToastProvider swipeDirection='right' swipeThreshold={75}>
      <ToastViewport
        hotkey={[]}
        label='Notifications'
        className='fixed right-0 bottom-0 z-1090 flex flex-col gap-2 p-2 outline-none'
      >
        {toasts}
      </ToastViewport>
    </ToastProvider>
  );
}

export default ToastContainer;
