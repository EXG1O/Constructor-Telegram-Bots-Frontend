import React, { forwardRef, HTMLAttributes } from 'react';

import Feedback from 'components/ui/Feedback';
import Select, { SelectProps, selectVariants } from 'components/ui/Select';

export { selectVariants as selectFeedbackVariants };

export interface SelectFeedbackProps extends Omit<SelectProps, 'invalid'> {
  error?: string;
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
}

const SelectFeedback = forwardRef<HTMLSelectElement, SelectFeedbackProps>(
  ({ error, wrapperProps, ...props }, ref) => {
    return (
      <div {...wrapperProps}>
        <Select {...props} ref={ref} invalid={Boolean(error)} />
        {error && <Feedback type='invalid'>{error}</Feedback>}
      </div>
    );
  },
);
SelectFeedback.displayName = 'SelectFeedback';

export default SelectFeedback;
