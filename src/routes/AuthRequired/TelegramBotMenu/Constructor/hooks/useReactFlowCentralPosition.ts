import { useCallback } from 'react';
import { useReactFlow, useStore, type XYPosition } from '@xyflow/react';

export function useReactFlowCentralPosition() {
  const { screenToFlowPosition } = useReactFlow();
  const domNode = useStore((state) => state.domNode);

  return useCallback((): XYPosition | null => {
    if (!domNode) return null;

    const rect: DOMRect = domNode.getBoundingClientRect();
    return screenToFlowPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  }, [domNode, screenToFlowPosition]);
}

export default useReactFlowCentralPosition;
