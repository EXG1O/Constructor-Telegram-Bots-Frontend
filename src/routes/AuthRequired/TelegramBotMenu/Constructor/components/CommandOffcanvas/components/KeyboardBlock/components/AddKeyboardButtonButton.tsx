import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Button, { ButtonProps } from 'components/Button';

import { useCommandOffcanvasStore } from '../../../store';

export type AddKeyboardButtonButtonProps = Pick<ButtonProps, 'className'>;

function AddKeyboardButtonButton(
	props: AddKeyboardButtonButtonProps,
): ReactElement<AddKeyboardButtonButtonProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'commandOffcanvas.keyboardBlock.addButtonButton',
	});

	const disabled = useCommandOffcanvasStore(
		({ keyboardButtonBlock: { show, type } }) => show && type === 'add',
	);
	const showAddKeyboardButtonBlock = useCommandOffcanvasStore(
		(state) => state.keyboardButtonBlock.showBlock,
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
