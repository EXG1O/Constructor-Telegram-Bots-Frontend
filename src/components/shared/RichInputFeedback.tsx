import React, { type HTMLAttributes, type ReactElement } from 'react';

import Feedback from 'components/ui/Feedback';
import RichInput, { type RichInputProps } from 'components/ui/RichInput';

import cn from 'utils/cn';

export interface RichInputFeedbackProps extends RichInputProps {
  error?: string;
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
}

function RichInputFeedback({
  size,
  error,
  wrapperProps,
  ...props
}: RichInputFeedbackProps): ReactElement {
  return (
    <div {...wrapperProps} className={cn('w-full', wrapperProps?.className)}>
      <RichInput {...props} size={size} invalid={Boolean(error)} />
      {error && (
        <Feedback size={size} type='invalid'>
          {error}
        </Feedback>
      )}
    </div>
  );
}

export default RichInputFeedback;
