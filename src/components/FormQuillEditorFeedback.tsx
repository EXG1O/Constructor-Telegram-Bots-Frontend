import React, { ReactElement, useCallback } from 'react';
import { useField, useFormikContext } from 'formik';

import QuillEditorFeedback, { QuillEditorFeedbackProps } from './QuillEditorFeedback';

export interface FormQuillEditorFeedbackProps extends QuillEditorFeedbackProps {
	name: string;
}

function FormQuillEditorFeedback({
	name,
	...props
}: FormQuillEditorFeedbackProps): ReactElement<FormQuillEditorFeedbackProps> {
	const { setFieldValue } = useFormikContext();
	const [{ value }, meta] = useField({ name });

	const handleChange = useCallback<NonNullable<QuillEditorFeedbackProps['onChange']>>(
		(value) => setFieldValue(name, value),
		[name],
	);

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
