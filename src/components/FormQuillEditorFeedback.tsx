import React, { ReactElement, useCallback } from 'react';
import { useField } from 'formik';

import QuillEditorFeedback, { QuillEditorFeedbackProps } from './QuillEditorFeedback';

export interface FormQuillEditorFeedbackProps extends QuillEditorFeedbackProps {
	name: string;
}

type ChangeHandler = NonNullable<QuillEditorFeedbackProps['onChange']>;

function FormQuillEditorFeedback({
	name,
	...props
}: FormQuillEditorFeedbackProps): ReactElement<FormQuillEditorFeedbackProps> {
	const [{ value }, meta, { setValue }] = useField(name);

	const handleChange = useCallback<ChangeHandler>((value) => setValue(value), [name]);

	return (
		<QuillEditorFeedback
			{...props}
			value={value}
			error={meta.error}
			onChange={handleChange}
		/>
	);
}

export default FormQuillEditorFeedback;
