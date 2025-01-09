import React, { ReactElement } from 'react';
import { useShallow } from 'zustand/react/shallow';

import Input, { FormControlProps as InputProps } from 'react-bootstrap/FormControl';

import useConditionOffcanvasStore from '../../../hooks/useConditionOffcanvasStore';

export type SecondValue = string;

export interface SecondValueInputProps
	extends Omit<InputProps, 'value' | 'defaultValue' | 'onChange'> {
	index: number;
}

export const defaultSecondValue: SecondValue = '';

function SecondValueInput({
	index,
	...props
}: SecondValueInputProps): ReactElement<SecondValueInputProps> {
	const value = useConditionOffcanvasStore(
		useShallow((store) => store.parts[index].secondValue),
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
					parts[index].secondValue = e.target.value;
				})
			}
		/>
	);
}

export default SecondValueInput;
