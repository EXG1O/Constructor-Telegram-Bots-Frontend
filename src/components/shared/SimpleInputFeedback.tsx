import React, { type HTMLAttributes, type ReactElement } from 'react';

import Feedback from 'components/ui/Feedback';
import SimpleInput, { type SimpleInputProps } from 'components/ui/SimpleInput';

import cn from 'utils/cn';

export interface SimpleInputFeedbackProps extends Omit<SimpleInputProps, 'invalid'> {
  error?: string;
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
}

function SimpleInputFeedback({
  size,
  error,
  wrapperProps,
  ...props
}: SimpleInputFeedbackProps): ReactElement {
  return (
    <div {...wrapperProps} className={cn('w-full', wrapperProps?.className)}>
      <SimpleInput {...props} size={size} invalid={Boolean(error)} />
      {error && (
        <Feedback size={size} type='invalid'>
          {error}
        </Feedback>
      )}
    </div>
  );
}

export default SimpleInputFeedback;
