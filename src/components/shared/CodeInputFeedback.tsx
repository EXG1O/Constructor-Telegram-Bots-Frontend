import React, { type HTMLAttributes, type ReactElement } from 'react';

import CodeInput, { type CodeInputProps } from 'components/ui/CodeInput';
import Feedback from 'components/ui/Feedback';

import cn from 'utils/cn';

export interface CodeInputFeedbackProps extends CodeInputProps {
  error?: string;
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
}

function CodeInputFeedback({
  size,
  error,
  wrapperProps,
  ...props
}: CodeInputFeedbackProps): ReactElement {
  return (
    <div {...wrapperProps} className={cn('w-full', wrapperProps?.className)}>
      <CodeInput {...props} size={size} invalid={Boolean(error)} />
      {error && (
        <Feedback size={size} type='invalid'>
          {error}
        </Feedback>
      )}
    </div>
  );
}

export default CodeInputFeedback;
