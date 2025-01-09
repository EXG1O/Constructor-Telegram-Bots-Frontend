import React, { ReactElement } from 'react';

import Feedback from 'react-bootstrap/Feedback';

import QuillEditor, { QuillEditorProps } from './QuillEditor';

import('./QuillEditorFeedback.scss');

export interface QuillEditorFeedbackProps extends QuillEditorProps {
	error?: string;
}

function QuillEditorFeedback({
	error,
	...props
}: QuillEditorFeedbackProps): ReactElement<QuillEditorFeedbackProps> {
	return (
		<div>
			<QuillEditor {...props} />
			{error && <Feedback type='invalid'>{error}</Feedback>}
		</div>
	);
}

export default QuillEditorFeedback;
