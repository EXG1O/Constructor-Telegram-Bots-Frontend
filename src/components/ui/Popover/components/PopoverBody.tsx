import React from 'react';
import {
  PopoverArrow,
  PopoverContent,
  type PopoverContentProps,
  PopoverPortal,
} from '@radix-ui/react-popover';
import { cva, type VariantProps } from 'class-variance-authority';
import Z_INDEX from 'tokens/z-index';

import cn from 'utils/cn';
import composeHandlers from 'utils/composeHandlers';

export const popoverBodyVariants = cva(
  [
    Z_INDEX.POPOVER,
    'max-h-(--radix-popover-content-available-height)',
    'bg-background',
    'text-foreground',
    'border',
    'border-outline',
    'outline-none',
    'shadow-sm',
    'overflow-y-auto',
    'scrollbar-thin',
    'data-[state=open]:animate-in',
    'data-[state=open]:fade-in-0',
    'data-[state=open]:zoom-in-85',
    'data-[side=top]:slide-in-from-bottom-2',
    'data-[side=left]:slide-in-from-right-2',
    'data-[side=right]:slide-in-from-left-2',
    'data-[side=bottom]:slide-in-from-top-2',
    'data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0',
    'data-[state=closed]:zoom-out-85',
    'origin-(--radix-popover-content-transform-origin)',
  ],
  {
    variants: {
      size: {
        sm: ['text-sm', 'rounded-sm'],
        md: ['text-base', 'rounded-md'],
        lg: ['text-lg', 'rounded-lg'],
      },
      content: {
        text: null,
        custom: null,
      },
    },
    compoundVariants: [
      {
        content: 'text',
        className: ['max-w-(--radix-popover-content-available-width)'],
      },
      {
        size: 'sm',
        content: 'text',
        className: ['px-2', 'py-0.5'],
      },
      {
        size: 'md',
        content: 'text',
        className: ['px-3', 'py-1.5'],
      },
      {
        size: 'lg',
        content: 'text',
        className: ['px-4', 'py-2'],
      },
      {
        content: 'custom',
        className: ['w-70'],
      },
      {
        size: 'sm',
        content: 'custom',
        className: ['p-1'],
      },
      {
        size: 'md',
        content: 'custom',
        className: ['p-2'],
      },
      {
        size: 'lg',
        content: 'custom',
        className: ['p-3'],
      },
    ],
    defaultVariants: {
      size: 'md',
      content: 'custom',
    },
  },
);

export interface PopoverBodyProps
  extends
    Omit<PopoverContentProps, 'content'>,
    VariantProps<typeof popoverBodyVariants> {}

const PopoverBody = React.forwardRef<HTMLDivElement, PopoverBodyProps>(
  (
    {
      size,
      content,
      side,
      sideOffset,
      collisionPadding = 8,
      className,
      children,
      onWheel,
      onTouchMove,
      ...props
    },
    ref,
  ) => {
    return (
      <PopoverPortal>
        <PopoverContent
          {...props}
          ref={ref}
          side={side ?? (content === 'text' ? 'top' : 'bottom')}
          sideOffset={sideOffset ?? (content === 'text' ? 2 : 4)}
          collisionPadding={collisionPadding}
          onWheel={composeHandlers((event) => event.stopPropagation(), onWheel)}
          onTouchMove={composeHandlers((event) => event.stopPropagation(), onTouchMove)}
          className={cn(popoverBodyVariants({ size, content, className }))}
        >
          <PopoverArrow className='fill-outline' />
          {children}
        </PopoverContent>
      </PopoverPortal>
    );
  },
);
PopoverBody.displayName = 'PopoverBody';

export default PopoverBody;
