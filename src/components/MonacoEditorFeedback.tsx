import React, { memo, ReactElement, useMemo } from 'react';
import classNames from 'classnames';

import Feedback from 'components/ui/Feedback';
import MonacoEditor, { MonacoEditorProps } from 'components/ui/MonacoEditor';

import('./MonacoEditorFeedback.scss');

export interface MonacoEditorFeedbackProps extends MonacoEditorProps {
  error?: string;
}

function MonacoEditorFeedback({
  error,
  wrapperProps: wrapperExtraProps,
  className,
  ...props
}: MonacoEditorFeedbackProps): ReactElement<MonacoEditorFeedbackProps> {
  const extraClassName = useMemo<string>(
    () => classNames({ 'is-invalid': Boolean(error) }),
    [error],
  );
  const wrapperProps = useMemo<MonacoEditorProps['wrapperProps']>(
    () =>
      Object.assign(wrapperExtraProps || {}, {
        className: classNames(
          (wrapperExtraProps as Record<string, string> | undefined)?.className,
          extraClassName,
        ),
      }),
    [wrapperExtraProps],
  );

  return (
    <div>
      <MonacoEditor
        {...props}
        wrapperProps={wrapperProps}
        className={classNames(className, extraClassName)}
      />
      {error && <Feedback type='invalid'>{error}</Feedback>}
    </div>
  );
}

export default memo(MonacoEditorFeedback);
