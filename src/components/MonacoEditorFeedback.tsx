import React, { ReactElement, useMemo } from 'react';
import classNames from 'classnames';

import Feedback from './Feedback';
import MonacoEditor, { MonacoEditorProps } from './MonacoEditor';

import('./MonacoEditorFeedback.scss');

export interface MonacoEditorFeedbackProps extends MonacoEditorProps {
	error?: string;
}

function MonacoEditorFeedback({
	error,
	wrapperProps,
	className,
	...props
}: MonacoEditorFeedbackProps): ReactElement<MonacoEditorFeedbackProps> {
	const extraClassName = useMemo<string>(
		() => classNames({ 'is-invalid': Boolean(error) }),
		[error],
	);
	const customWrapperProps = useMemo<MonacoEditorProps['wrapperProps']>(
		() =>
			Object.assign(wrapperProps || {}, {
				className: classNames(
					(wrapperProps as Record<string, string> | undefined)?.className,
					extraClassName,
				),
			}),
		[wrapperProps],
	);

	return (
		<div>
			<MonacoEditor
				{...props}
				wrapperProps={customWrapperProps}
				className={classNames(className, extraClassName)}
			/>
			{error && <Feedback type='invalid'>{error}</Feedback>}
		</div>
	);
}

export default MonacoEditorFeedback;
