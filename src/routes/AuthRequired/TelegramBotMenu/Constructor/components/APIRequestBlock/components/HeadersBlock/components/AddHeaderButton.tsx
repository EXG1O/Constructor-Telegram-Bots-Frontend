import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import Button, { ButtonProps } from 'react-bootstrap/Button';

import useAPIRequestBlockStore from '../../../hooks/useAPIRequestBlockStore';

export type AddHeaderButtonProps = Omit<
	ButtonProps,
	'size' | 'variant' | 'children' | 'onClick'
>;

function AddHeaderButton(
	props: AddHeaderButtonProps,
): ReactElement<AddHeaderButtonProps> {
	const { t } = useTranslation('telegram-bot-menu-constructor', {
		keyPrefix: 'apiRequestBlock.headersBlock.addHeaderButton',
	});

	const updateAPIRequest = useAPIRequestBlockStore((state) => state.updateAPIRequest);

	return (
		<Button
			{...props}
			size='sm'
			variant='dark'
			onClick={() =>
				updateAPIRequest((apiRequest) => {
					apiRequest.headers.push({ key: '', value: '' });
				})
			}
		>
			{t('text')}
		</Button>
	);
}

export default memo(AddHeaderButton);
