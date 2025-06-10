import React, { forwardRef, HTMLAttributes } from 'react';

import Check, { CheckProps, checkVariants } from 'components/ui/Check';
import Feedback from 'components/ui/Feedback';

import cn from 'utils/cn';

export { checkVariants as checkFeedbackVariants };

export interface CheckFeedbackProps extends Omit<CheckProps, 'invalid'> {
  error?: string;
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
}

const CheckFeedback = forwardRef<HTMLInputElement, CheckFeedbackProps>(
  ({ error, wrapperProps, ...props }, ref) => {
    return (
      <div {...wrapperProps} className={cn('block', 'w-full', wrapperProps?.className)}>
        <Check {...props} ref={ref} invalid={Boolean(error)} />
        {error && <Feedback type='invalid'>{error}</Feedback>}
      </div>
    );
  },
);
CheckFeedback.displayName = 'CheckFeedback';

export default CheckFeedback;
