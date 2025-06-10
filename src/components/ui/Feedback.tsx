import React from 'react';
import { forwardRef, HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, VariantProps } from 'class-variance-authority';

import cn from 'utils/cn';

export const feedbackVariants = cva(['block', 'w-full', 'text-sm', 'mt-1'], {
  variants: {
    type: {
      invalid: ['text-danger'],
    },
  },
});

export interface FeedbackProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof feedbackVariants> {
  asChild?: boolean;
}

const Feedback = forwardRef<HTMLDivElement, FeedbackProps>(
  ({ asChild, type, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        {...props}
        ref={ref}
        className={cn(feedbackVariants({ type, className }))}
      />
    );
  },
);
Feedback.displayName = 'Feedback';

export default Feedback;
