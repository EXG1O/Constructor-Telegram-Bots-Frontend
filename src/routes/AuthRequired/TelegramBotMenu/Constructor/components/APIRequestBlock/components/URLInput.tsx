import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import Input, { FormControlProps as InputProps } from 'react-bootstrap/FormControl';

import useAPIRequestBlockStore from '../hooks/useAPIRequestBlockStore';

export type URL = string;

export type URLInputProps = Omit<
	InputProps,
	'value' | 'placeholder' | 'children' | 'onChange'
>;

export const defaultURL: URL = '';

function URLInput(props: URLInputProps): ReactElement<URLInputProps> {
	const { t } = useTranslation('telegram-bot-menu-constructor', {
		keyPrefix: 'apiRequestBlock.urlInput',
	});

	const url = useAPIRequestBlockStore((state) => state.apiRequest.url);
	const updateAPIRequest = useAPIRequestBlockStore((state) => state.updateAPIRequest);

	return (
		<Input
			{...props}
			value={url}
			placeholder={t('placeholder')}
			onChange={(e) =>
				updateAPIRequest((apiRequest) => {
					apiRequest.url = e.target.value;
				})
			}
		/>
	);
}

export default memo(URLInput);
