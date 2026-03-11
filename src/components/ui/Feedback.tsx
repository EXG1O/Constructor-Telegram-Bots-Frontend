import React from 'react';
import { forwardRef, type HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import cn from 'utils/cn';

export const feedbackVariants = cva(['w-full'], {
  variants: {
    size: {
      sm: ['text-xs', 'mt-0.5'],
      md: ['text-sm', 'mt-1'],
      lg: ['text-base', 'mt-2'],
    },
    type: {
      invalid: ['text-danger'],
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface FeedbackProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof feedbackVariants> {
  asChild?: boolean;
}

const Feedback = forwardRef<HTMLDivElement, FeedbackProps>(
  ({ asChild, size, type, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        {...props}
        ref={ref}
        className={cn(feedbackVariants({ size, type, className }))}
      />
    );
  },
);
Feedback.displayName = 'Feedback';

export default Feedback;
