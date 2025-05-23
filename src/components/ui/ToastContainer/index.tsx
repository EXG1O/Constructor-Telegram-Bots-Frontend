import React, { ReactElement } from 'react';
import { AnimatePresence } from 'framer-motion';

import { useToastContainerStore } from './store';

export { createMessageToast } from './components/MessageToast';

function ToastContainer(): ReactElement {
  const toasts = useToastContainerStore((state) => state.toasts);

  return (
    <div className='fixed right-0 bottom-0 flex flex-col gap-2 p-2'>
      <AnimatePresence>{toasts}</AnimatePresence>
    </div>
  );
}

export default ToastContainer;
