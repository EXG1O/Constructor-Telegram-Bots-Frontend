import React, { ReactElement } from 'react';
import { useShallow } from 'zustand/react/shallow';

import Input, { FormControlProps as InputProps } from 'react-bootstrap/FormControl';

import useConditionOffcanvasStore from '../../../hooks/useConditionOffcanvasStore';

export type FirstValue = string;

export interface FirstValueInputProps
	extends Omit<InputProps, 'value' | 'defaultValue' | 'onChange'> {
	index: number;
}

export const defaultFirstValue: FirstValue = '';

function FirstValueInput({
	index,
	...props
}: FirstValueInputProps): ReactElement<FirstValueInputProps> {
	const value = useConditionOffcanvasStore(
		useShallow((store) => store.parts[index].firstValue),
	);
	const updateParts = useConditionOffcanvasStore(
		useShallow((store) => store.updateParts),
	);

	return (
		<Input
			{...props}
			value={value}
			onChange={(e) =>
				updateParts((parts) => {
					parts[index].firstValue = e.target.value;
				})
			}
		/>
	);
}

export default FirstValueInput;
