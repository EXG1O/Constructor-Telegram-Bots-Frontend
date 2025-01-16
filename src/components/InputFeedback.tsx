import React, { forwardRef, HTMLAttributes, memo } from 'react';

import Feedback from './Feedback';
import Input, { InputProps } from './Input';

import { FCA } from 'utils/helpers';

import('./InputFeedback.scss');

export interface InputFeedbackProps extends Omit<InputProps, 'isInvalid'> {
	error?: string;
	containerProps?: HTMLAttributes<HTMLDivElement>;
}

const InputFeedback: FCA<'input', InputFeedbackProps> = forwardRef<
	HTMLElement,
	InputFeedbackProps
>(function InputFeedback({ as, error, containerProps, ...props }, ref) {
	return (
		<div {...containerProps}>
			<Input as={as} ref={ref} {...props} isInvalid={Boolean(error)} />
			{error && <Feedback type='invalid'>{error}</Feedback>}
		</div>
	);
});

export default memo(InputFeedback);
