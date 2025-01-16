import React, { ReactElement } from 'react';
import { useField } from 'formik';

import SelectFeedback, { SelectFeedbackProps } from './SelectFeedback';

export interface FormSelectFeedbackProps extends SelectFeedbackProps {
	name: string;
}

function FormSelectFeedback({
	size,
	...props
}: FormSelectFeedbackProps): ReactElement<FormSelectFeedbackProps> {
	const [field, meta] = useField(props);

	return <SelectFeedback {...props} {...field} size={size} error={meta.error} />;
}

export default FormSelectFeedback;
