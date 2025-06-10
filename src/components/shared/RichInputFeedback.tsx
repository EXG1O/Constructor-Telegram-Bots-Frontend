import React, { HTMLAttributes, ReactElement } from 'react';

import Feedback from 'components/ui/Feedback';
import RichInput, { RichInputProps } from 'components/ui/RichInput';

import cn from 'utils/cn';

export interface RichInputFeedbackProps extends RichInputProps {
  error?: string;
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
}

function RichInputFeedback({
  error,
  wrapperProps,
  ...props
}: RichInputFeedbackProps): ReactElement {
  return (
    <div {...wrapperProps} className={cn('block', 'w-full', wrapperProps?.className)}>
      <RichInput {...props} invalid={Boolean(error)} />
      {error && <Feedback type='invalid'>{error}</Feedback>}
    </div>
  );
}

export default RichInputFeedback;
