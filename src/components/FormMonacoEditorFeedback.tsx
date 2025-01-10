import React, { ReactElement, useCallback } from 'react';
import { useField } from 'formik';

import MonacoEditorFeedback, {
	MonacoEditorFeedbackProps,
} from './MonacoEditorFeedback';

export interface FormMonacoEditorFeedbackProps extends MonacoEditorFeedbackProps {
	name: string;
}

type ChangeHandler = NonNullable<MonacoEditorFeedbackProps['onChange']>;

function FormMonacoEditorFeedback({
	name,
	...props
}: FormMonacoEditorFeedbackProps): ReactElement<FormMonacoEditorFeedbackProps> {
	const [{ value }, meta, { setValue }] = useField(name);

	const handleChange = useCallback<ChangeHandler>(
		(_editor, value) => setValue(value),
		[name],
	);

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
