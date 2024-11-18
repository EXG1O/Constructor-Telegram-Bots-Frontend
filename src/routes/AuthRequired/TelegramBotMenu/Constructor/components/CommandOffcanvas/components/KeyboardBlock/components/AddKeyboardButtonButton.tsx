import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Button, { ButtonProps } from 'components/Button';

import useCommandOffcanvasStore from '../../../hooks/useCommandOffcanvasStore';

export type AddKeyboardButtonButtonProps = Omit<
	ButtonProps,
	'size' | 'variant' | 'children' | 'onClick'
>;

function AddKeyboardButtonButton(
	props: AddKeyboardButtonButtonProps,
): ReactElement<AddKeyboardButtonButtonProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
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
