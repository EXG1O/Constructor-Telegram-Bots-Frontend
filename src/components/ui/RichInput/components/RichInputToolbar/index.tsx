import React, { forwardRef, type HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import ToolbarButton from './components/ToolbarButton';
import ToolbarGroup from './components/ToolbarGroup';
import ToolbarLinkButton from './components/ToolbarLinkButton';

import cn from 'utils/cn';

import { DEFAULT_SIZE } from '../..';
import { useRichInputStore } from '../../store';

export const richInputToolbarVariants = cva(
  ['flex', 'w-full', 'border-b', 'border-b-outline'],
  {
    variants: {
      size: {
        sm: ['gap-4.5', 'px-2.5', 'py-1'],
        md: ['gap-5.5', 'px-3', 'py-1.5'],
        lg: ['gap-6.5', 'px-3.5', 'py-2'],
      },
    },
    defaultVariants: {
      size: DEFAULT_SIZE,
    },
  },
);

export interface RichInputToolbarProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const RichInputToolbar = forwardRef<HTMLDivElement, RichInputToolbarProps>(
  ({ asChild, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'div';

    const size = useRichInputStore((store) => store.size);

    const setToolbarElement = useRichInputStore((store) => store.setToolbarElement);

    function mergeRefs(element: HTMLDivElement | null): void {
      setToolbarElement(element);
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    }

    return (
      <Component
        {...props}
        ref={mergeRefs}
        className={cn(richInputToolbarVariants({ size, className }))}
      />
    );
  },
);
RichInputToolbar.displayName = 'RichInputToolbar';

export default Object.assign(RichInputToolbar, {
  Group: ToolbarGroup,
  Button: ToolbarButton,
  LinkButton: ToolbarLinkButton,
});
