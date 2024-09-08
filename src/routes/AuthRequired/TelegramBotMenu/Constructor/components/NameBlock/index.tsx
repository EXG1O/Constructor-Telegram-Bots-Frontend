import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { StoreApi, UseBoundStore } from 'zustand';

import Input from 'react-bootstrap/FormControl';

import Block, { BlockProps } from '../Block';

import { NameBlockSlice } from './store';

export type Name = string;

export interface NameBlockProps extends Omit<BlockProps, 'title' | 'children'> {
	store: UseBoundStore<StoreApi<NameBlockSlice>>;
}

export const defaultName: Name = '';

function NameBlock({ store, ...props }: NameBlockProps): ReactElement<NameBlockProps> {
	const { t } = useTranslation('telegram-bot-menu-constructor', {
		keyPrefix: 'nameBlock',
	});

	const name = store((state) => state.name);
	const setName = store((state) => state.setName);

	return (
		<Block {...props} title={t('title')} body>
			<Input
				value={name}
				placeholder={t('inputPlaceholder')}
				onChange={(e) => setName(e.target.value)}
			/>
		</Block>
	);
}

export default memo(NameBlock);
