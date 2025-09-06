import React, { HTMLAttributes, ReactElement } from 'react';

import Feedback from 'components/ui/Feedback';
import SimpleInput, { SimpleInputProps } from 'components/ui/SimpleInput';

import cn from 'utils/cn';

export interface SimpleInputFeedbackProps extends Omit<SimpleInputProps, 'invalid'> {
  error?: string;
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
}

function SimpleInputFeedback({
  error,
  wrapperProps,
  ...props
}: SimpleInputFeedbackProps): ReactElement {
  return (
    <div {...wrapperProps} className={cn('w-full', wrapperProps?.className)}>
      <SimpleInput {...props} invalid={Boolean(error)} />
      {error && <Feedback type='invalid'>{error}</Feedback>}
    </div>
  );
}

export default SimpleInputFeedback;
