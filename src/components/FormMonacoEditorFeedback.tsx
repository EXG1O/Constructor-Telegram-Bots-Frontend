import React, { ReactElement, useCallback } from 'react';
import { useField, useFormikContext } from 'formik';

import MonacoEditorFeedback, {
	MonacoEditorFeedbackProps,
} from './MonacoEditorFeedback';

export interface FormMonacoEditorFeedbackProps extends MonacoEditorFeedbackProps {
	name: string;
}

function FormMonacoEditorFeedback({
	name,
	...props
}: FormMonacoEditorFeedbackProps): ReactElement<FormMonacoEditorFeedbackProps> {
	const { setFieldValue } = useFormikContext();
	const [{ value }, meta] = useField({ name });

	const handleChange = useCallback<
		NonNullable<MonacoEditorFeedbackProps['onChange']>
	>((_editor, value) => setFieldValue(name, value), [name]);

	return (
		<MonacoEditorFeedback
			{...props}
			value={value}
			error={meta.error}
			onChange={handleChange}
		/>
	);
}

export default FormMonacoEditorFeedback;
