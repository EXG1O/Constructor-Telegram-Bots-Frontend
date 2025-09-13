import React, { forwardRef, HTMLAttributes, useEffect } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import useRichInputStore from '../hooks/useRichInputStore';

import cn from 'utils/cn';

export const richInputEditorInnerContentVariants = cva(
  [
    'text-foreground',
    'whitespace-break-spaces',
    'break-word',
    '*:first:mt-0',
    '*:last:mb-0',
    '[&_a]:text-primary',
    '[&_code]:bg-gray-200',
    '[&_code]:text-dark',
    '*:[.ql-code-block-container]:bg-dark',
    '*:[.ql-code-block-container]:font-mono',
    '*:[.ql-code-block-container]:text-white',
    '*:[blockquote]:border-l-gray-400',
  ],
  {
    variants: {
      size: {
        sm: [
          'text-sm',
          '*:my-0.5',
          '[&_code]:text-xs',
          '[&_code]:rounded-xs',
          '[&_code]:px-1',
          '[&_code]:py-0.5',
          '*:[.ql-code-block-container]:text-xs',
          '*:[.ql-code-block-container]:rounded-xs',
          '*:[.ql-code-block-container]:px-1',
          '*:[.ql-code-block-container]:py-0.5',
          '*:[blockquote]:border-l-3',
          '*:[blockquote]:px-3',
          '*:[blockquote]:py-1',
        ],
        md: [
          'text-base',
          '*:my-0.75',
          '[&_code]:text-sm',
          '[&_code]:rounded-sm',
          '[&_code]:px-1.5',
          '[&_code]:py-0.75',
          '*:[.ql-code-block-container]:text-sm',
          '*:[.ql-code-block-container]:rounded-sm',
          '*:[.ql-code-block-container]:px-1.5',
          '*:[.ql-code-block-container]:py-0.75',
          '*:[blockquote]:border-l-4',
          '*:[blockquote]:px-4',
          '*:[blockquote]:py-1',
        ],
        lg: [
          'text-lg',
          '*:my-1',
          '[&_code]:text-base',
          '[&_code]:rounded-md',
          '[&_code]:px-2',
          '[&_code]:py-1',
          '*:[.ql-code-block-container]:text-base',
          '*:[.ql-code-block-container]:rounded-md',
          '*:[.ql-code-block-container]:px-2',
          '*:[.ql-code-block-container]:py-1',
          '*:[blockquote]:border-l-5',
          '*:[blockquote]:px-4.5',
          '*:[blockquote]:py-1',
        ],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const richInputEditorContentVariants = cva(
  [
    'outline-0',
    'overflow-y-auto',
    'scrollbar-thin',
    '[.ql-blank]:before:absolute',
    '[.ql-blank]:before:content-[attr(data-placeholder)]',
    '[.ql-blank]:before:text-muted',
    '[.ql-blank]:before:cursor-text',
  ],
  {
    variants: {
      size: {
        sm: ['px-2.5', 'py-1'],
        md: ['px-3', 'py-1.5'],
        lg: ['px-3.5', 'py-2'],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface RichInputEditorProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  contentClassName?: string;
}

const RichInputEditor = forwardRef<HTMLDivElement, RichInputEditorProps>(
  ({ asChild, className, contentClassName, ...props }, ref) => {
    const Component = asChild ? Slot : 'div';

    const setEditorElement = useRichInputStore((state) => state.setEditorElement);

    const height = useRichInputStore((state) => state.height);
    const size = useRichInputStore((state) => state.size);

    const quill = useRichInputStore((state) => state.quill);
    const value = useRichInputStore((state) => state.value);

    useEffect(() => {
      if (!quill) return;

      quill.root.className = cn(
        quill.root.className,
        richInputEditorContentVariants({ size }),
        richInputEditorInnerContentVariants({ size }),
        contentClassName,
      );

      if (height) {
        quill.root.style.height = height;
      }
    }, [quill, contentClassName]);

    function mergeRefs(element: HTMLDivElement | null): void {
      setEditorElement(element);
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
        className={cn('relative', 'w-full', className)}
      >
        {!quill && value}
      </Component>
    );
  },
);
RichInputEditor.displayName = 'RichInputEditor';

export default RichInputEditor;
