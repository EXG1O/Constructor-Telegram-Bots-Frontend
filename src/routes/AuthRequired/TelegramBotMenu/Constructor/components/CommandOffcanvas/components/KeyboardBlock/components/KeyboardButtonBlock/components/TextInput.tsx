import React, { ReactElement, memo } from 'react';

import Input, { FormControlProps as InputProps } from 'react-bootstrap/FormControl';

import useCommandOffcanvasStore from '../../../../../hooks/useCommandOffcanvasStore';

export type TextInputProps = Omit<
	InputProps,
	'size' | 'value' | 'placeholder' | 'children' | 'onChange'
>;

export type Text = string;

export const defaultText: Text = '';

function TextInput(props: TextInputProps): ReactElement<TextInputProps> {
	const text = useCommandOffcanvasStore((state) => state.keyboardButton.text);
	const updateKeyboardButton = useCommandOffcanvasStore(
		(state) => state.updateKeyboardButton,
	);

	return (
		<Input
			{...props}
			size='sm'
			value={text}
			placeholder={gettext('Введите текст')}
			onChange={(e) =>
				updateKeyboardButton((keyboardButton) => {
					keyboardButton.text = e.target.value;
				})
			}
		/>
	);
}

export default memo(TextInput);
