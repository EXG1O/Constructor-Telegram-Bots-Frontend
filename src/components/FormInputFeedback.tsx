import React, { forwardRef } from 'react';
import { useField } from 'formik';

import InputFeedback, { InputFeedbackProps } from './InputFeedback';

import { FCA } from 'utils/helpers';

export interface FormInputFeedbackProps extends InputFeedbackProps {
	name: string;
}

const FormInputFeedback: FCA<'input', FormInputFeedbackProps> = forwardRef<
	HTMLElement,
	FormInputFeedbackProps
>(function FormInputFeedback({ size, ...props }, ref) {
	const [field, meta] = useField(props);

	return <InputFeedback ref={ref} {...props} {...field} error={meta.error} />;
});

export default FormInputFeedback;
