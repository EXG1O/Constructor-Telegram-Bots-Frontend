import React, { HTMLAttributes, ReactElement } from 'react';

import CodeInput, { CodeInputProps } from 'components/ui/CodeInput';
import Feedback from 'components/ui/Feedback';

import cn from 'utils/cn';

export interface CodeInputFeedbackProps extends CodeInputProps {
  error?: string;
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
}

function CodeInputFeedback({
  error,
  wrapperProps,
  ...props
}: CodeInputFeedbackProps): ReactElement {
  return (
    <div {...wrapperProps} className={cn('w-full', wrapperProps?.className)}>
      <CodeInput {...props} invalid={Boolean(error)} />
      {error && <Feedback type='invalid'>{error}</Feedback>}
    </div>
  );
}

export default CodeInputFeedback;
