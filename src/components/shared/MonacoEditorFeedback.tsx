import React, { HTMLAttributes, ReactElement } from 'react';

import Feedback from 'components/ui/Feedback';
import MonacoEditor, {
  MonacoEditorProps,
  monacoEditorVariants,
} from 'components/ui/MonacoEditor';

import cn from 'utils/cn';

export { monacoEditorVariants as monacoEditorFeedbackVariants };

export interface MonacoEditorFeedbackProps extends MonacoEditorProps {
  error?: string;
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
}

function MonacoEditorFeedback({
  error,
  wrapperProps,
  className,
  ...props
}: MonacoEditorFeedbackProps): ReactElement {
  return (
    <div {...wrapperProps} className={cn('w-full', wrapperProps?.className)}>
      <MonacoEditor {...props} invalid={Boolean(error)} />
      {error && <Feedback type='invalid'>{error}</Feedback>}
    </div>
  );
}

export default MonacoEditorFeedback;
