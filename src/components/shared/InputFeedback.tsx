import React, { forwardRef, HTMLAttributes } from 'react';

import Feedback from 'components/ui/Feedback';
import Input, { InputProps, inputVariants } from 'components/ui/Input';

export { inputVariants as inputFeedbackVariants };

export interface InputFeedbackProps extends Omit<InputProps, 'invalid'> {
  error?: string;
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
}

const InputFeedback = forwardRef<HTMLInputElement, InputFeedbackProps>(
  ({ error, wrapperProps, ...props }, ref) => {
    return (
      <div {...wrapperProps}>
        <Input {...props} ref={ref} invalid={Boolean(error)} />
        {error && <Feedback type='invalid'>{error}</Feedback>}
      </div>
    );
  },
);
InputFeedback.displayName = 'InputFeedback';

export default InputFeedback;
