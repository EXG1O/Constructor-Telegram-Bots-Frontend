import React, { forwardRef, InputHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import { DEFAULT_SIZE } from '..';

import useSimpleInputStore from '../hooks/useSimpleInputStore';

import cn from 'utils/cn';

export const simpleInputEditorVariants = cva(
  [
    'w-full',
    'text-foreground',
    'appearance-none',
    'placeholder:text-muted',
    'focus:outline-none',
  ],
  {
    variants: {
      size: {
        sm: ['text-sm', 'px-2', 'py-1'],
        md: ['text-base', 'px-3', 'py-1.5'],
        lg: ['text-lg', 'px-4', 'py-2'],
      },
    },
    defaultVariants: {
      size: DEFAULT_SIZE,
    },
  },
);

export interface SimpleInputEditorProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange' | 'placeholder'
  > {
  asChild?: boolean;
}

const SimpleInputEditor = forwardRef<HTMLInputElement, SimpleInputEditorProps>(
  ({ asChild, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'input';

    const size = useSimpleInputStore((state) => state.size);
    const autoFocus = useSimpleInputStore((state) => state.autoFocus);
    const value = useSimpleInputStore((state) => state.value);
    const placeholder = useSimpleInputStore((state) => state.placeholder);
    const setValue = useSimpleInputStore((state) => state.setValue);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
      setValue(event.target.value);
    }

    return (
      <Component
        {...props}
        ref={ref}
        autoFocus={autoFocus}
        value={value}
        placeholder={placeholder}
        className={cn(simpleInputEditorVariants({ size, className }))}
        onChange={handleChange}
      />
    );
  },
);
SimpleInputEditor.displayName = 'SimpleInputEditor';

export default SimpleInputEditor;
