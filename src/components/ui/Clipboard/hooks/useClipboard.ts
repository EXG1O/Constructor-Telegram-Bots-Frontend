import { useContext } from 'react';

import ClipboardContext, {
  type ClipboardContextProps,
} from '../contexts/ClipboardContext';

function useClipboard(): ClipboardContextProps {
  const context = useContext<ClipboardContextProps | undefined>(ClipboardContext);

  if (context === undefined) {
    throw new Error('useClipboard must be used with a Clipboard.');
  }

  return context;
}

export default useClipboard;
