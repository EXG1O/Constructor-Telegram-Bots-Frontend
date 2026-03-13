import { type ReactNode, useEffect } from 'react';

import { useRichInputStore } from '../store';

export interface RichInputInnerProps {
  children?: ReactNode;
}

function RichInputInner({ children }: RichInputInnerProps): ReactNode {
  const toolbarElement = useRichInputStore((state) => state.toolbarElement);
  const editorElement = useRichInputStore((state) => state.editorElement);
  const initQuill = useRichInputStore((state) => state.initQuill);

  useEffect(() => {
    if (!toolbarElement || !editorElement) return;
    initQuill();
  }, [toolbarElement, editorElement]);

  return children;
}

export default RichInputInner;
