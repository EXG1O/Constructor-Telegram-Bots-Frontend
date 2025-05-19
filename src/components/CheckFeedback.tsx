import React, { forwardRef, memo } from 'react';

import Check, { CheckProps } from 'components/ui/Check';

import { FCA } from 'utils/helpers';

import('./CheckFeedback.scss');

export interface CheckFeedbackProps extends Omit<CheckProps, 'isInvalid'> {
  error?: string;
}

const CheckFeedback: FCA<'input', CheckFeedbackProps> = forwardRef<
  HTMLElement,
  CheckFeedbackProps
>(function CheckFeedback({ as, error, ...props }, ref) {
  return (
    <Check
      as={as}
      ref={ref}
      {...props}
      isInvalid={Boolean(error)}
      feedbackType='invalid'
      feedback={error}
    />
  );
});

export default memo(CheckFeedback);
