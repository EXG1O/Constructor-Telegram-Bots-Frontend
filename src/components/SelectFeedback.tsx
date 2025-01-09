import React, { ReactElement } from 'react';

import Feedback from './Feedback';
import Select, { SelectProps } from './Select';

import('./SelectFeedback.scss');

export interface SelectFeedbackProps extends Omit<SelectProps, 'isInvalid'> {
	error?: string;
}

function SelectFeedback({
	error,
	...props
}: SelectFeedbackProps): ReactElement<SelectFeedbackProps> {
	return (
		<div>
			<Select {...props} isInvalid={Boolean(error)} />
			{error && <Feedback type='invalid'>{error}</Feedback>}
		</div>
	);
}

export default SelectFeedback;
