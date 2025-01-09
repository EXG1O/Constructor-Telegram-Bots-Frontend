import React, { ReactElement } from 'react';
import classNames from 'classnames';

import Feedback from './Feedback';
import QuillEditor, { QuillEditorProps } from './QuillEditor';

import('./QuillEditorFeedback.scss');

export interface QuillEditorFeedbackProps extends QuillEditorProps {
	error?: string;
}

function QuillEditorFeedback({
	error,
	className,
	...props
}: QuillEditorFeedbackProps): ReactElement<QuillEditorFeedbackProps> {
	return (
		<div>
			<QuillEditor
				{...props}
				className={classNames({ 'is-invalid': Boolean(error) }, className)}
			/>
			{error && <Feedback type='invalid'>{error}</Feedback>}
		</div>
	);
}

export default QuillEditorFeedback;
