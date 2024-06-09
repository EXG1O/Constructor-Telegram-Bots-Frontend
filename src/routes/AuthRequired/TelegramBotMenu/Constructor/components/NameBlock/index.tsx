import React, { ReactElement, memo } from 'react';
import { UseBoundStore, StoreApi } from 'zustand';

import Input from 'react-bootstrap/FormControl';

import Block, { BlockProps } from '../Block';

import { NameBlockSlice } from './store';

export type Name = string;

export interface NameBlockProps extends Omit<BlockProps, 'title' | 'children'> {
	store: UseBoundStore<StoreApi<NameBlockSlice>>;
}

export const defaultName: Name = '';

function NameBlock({ store, ...props }: NameBlockProps): ReactElement<NameBlockProps> {
	const name = store((state) => state.name);
	const setName = store((state) => state.setName);

	return (
		<Block {...props} title={gettext('Название')} body>
			<Input
				value={name}
				placeholder={gettext('Придумайте название')}
				onChange={(e) => setName(e.target.value)}
			/>
		</Block>
	);
}

export default memo(NameBlock);
