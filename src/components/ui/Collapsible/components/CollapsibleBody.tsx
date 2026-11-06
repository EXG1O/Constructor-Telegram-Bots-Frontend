import React, { forwardRef, useLayoutEffect, useRef, useState } from 'react';
import {
  CollapsibleContent,
  type CollapsibleContentProps,
} from '@radix-ui/react-collapsible';

import cn from 'utils/cn';
import composeHandlers from 'utils/composeHandlers';

export interface CollapsibleBodyProps extends CollapsibleContentProps {}

const CollapsibleBody = forwardRef<HTMLDivElement, CollapsibleBodyProps>(
  ({ className, onAnimationStart, onAnimationEnd, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const contentRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
      if (contentRef.current?.dataset.state !== 'open') return;
      setVisible(true);
    }, []);

    function mergeRefs(element: HTMLDivElement | null): void {
      contentRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    }

    function handleAnimationStart(event: React.AnimationEvent<HTMLDivElement>): void {
      if (event.target !== event.currentTarget) return;
      setVisible(false);
    }

    function handleAnimationEnd(event: React.AnimationEvent<HTMLDivElement>): void {
      if (event.target !== event.currentTarget) return;
      setVisible(event.currentTarget.dataset.state === 'open');
    }

    return (
      <CollapsibleContent
        {...props}
        ref={mergeRefs}
        onAnimationStart={composeHandlers(onAnimationStart, handleAnimationStart)}
        onAnimationEnd={composeHandlers(onAnimationEnd, handleAnimationEnd)}
        className={cn(
          'w-full',
          'overflow-hidden',
          visible && 'data-[state=open]:overflow-visible',
          'data-[state=open]:animate-collapsible-down',
          'data-[state=closed]:animate-collapsible-up',
          className,
        )}
      />
    );
  },
);
CollapsibleBody.displayName = 'CollapsibleBody';

export default CollapsibleBody;
