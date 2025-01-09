import React, { forwardRef } from 'react';

import Input, { InputProps } from './Input';

import { FCA } from 'utils/helpers';

import('./InputFeedback.scss');

export interface InputFeedbackProps extends Omit<InputProps, 'isInvalid'> {
	error?: string;
}

const InputFeedback: FCA<'input', InputFeedbackProps> = forwardRef<
	HTMLElement,
	InputFeedbackProps
>(function InputFeedback({ as, error, ...props }, ref) {
	return (
		<div>
			<Input as={as} ref={ref} {...props} isInvalid={Boolean(error)} />
			{error && <Input.Feedback type='invalid'>{error}</Input.Feedback>}
		</div>
	);
});

export default InputFeedback;
