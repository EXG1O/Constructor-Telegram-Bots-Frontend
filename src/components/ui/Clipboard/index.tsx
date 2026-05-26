import React, {
  type ReactElement,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import ClipboardJS from 'clipboard';

import ClipboardButton from './components/ClipboardButton';
import ClipboardIcon from './components/ClipboardIcon';
import ClipboardSlot from './components/ClipboardSlot';
import ClipboardContext, {
  type ClipboardContextProps,
} from './contexts/ClipboardContext';

import { createMessageToast } from '../ToastContainer';

export interface ClipboardProps {
  children?: ReactNode;
}

function Clipboard({ children }: ClipboardProps): ReactElement {
  const { t } = useTranslation('components', { keyPrefix: 'clipboard' });

  const id = useId();
  const triggerClassName: string = `clipboard-trigger-${id.replace(/:/g, '')}`;

  const containerRef = useRef<HTMLDivElement | null>(null);

  const contextValue = useMemo<ClipboardContextProps>(
    () => ({ triggerClassName }),
    [triggerClassName],
  );

  useEffect(() => {
    const clipboard = new ClipboardJS(`.${triggerClassName}`, {
      container: containerRef.current!,
    });

    clipboard.on('success', () =>
      createMessageToast({
        message: t('messages.copy.success'),
        level: 'success',
      }),
    );
    clipboard.on('error', () =>
      createMessageToast({
        message: t('messages.copy.error'),
        level: 'error',
      }),
    );

    return () => clipboard.destroy();
  }, []);

  return (
    <div ref={containerRef} className='contents'>
      <ClipboardContext.Provider value={contextValue}>
        {children}
      </ClipboardContext.Provider>
    </div>
  );
}

export default Object.assign(Clipboard, {
  Slot: ClipboardSlot,
  Icon: ClipboardIcon,
  Button: ClipboardButton,
});
