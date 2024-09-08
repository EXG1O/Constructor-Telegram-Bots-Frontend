import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import Button, { ButtonProps } from 'react-bootstrap/Button';

import useCommandOffcanvasStore from '../../../hooks/useCommandOffcanvasStore';

export type AddKeyboardButtonButtonProps = Omit<
	ButtonProps,
	'size' | 'variant' | 'children' | 'onClick'
>;

function AddKeyboardButtonButton(
	props: AddKeyboardButtonButtonProps,
): ReactElement<AddKeyboardButtonButtonProps> {
	const { t } = useTranslation('telegram-bot-menu-constructor', {
		keyPrefix: 'commandOffcanvas.keyboardBlock.addButtonButton',
	});

	const disabled = useCommandOffcanvasStore(
		(state) =>
			state.showKeyboardButtonBlock && state.keyboardButtonBlockType === 'add',
	);
	const showAddKeyboardButtonBlock = useCommandOffcanvasStore(
		(state) => state.showAddKeyboardButtonBlock,
	);

	return (
		<Button
			{...props}
			size='sm'
			variant='dark'
			disabled={disabled}
			onClick={() => showAddKeyboardButtonBlock()}
		>
			{t('text')}
		</Button>
	);
}

export default memo(AddKeyboardButtonButton);
