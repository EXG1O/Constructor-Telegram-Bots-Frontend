import React, { ReactElement, memo } from 'react';

import Input from 'react-bootstrap/FormControl';

import Block, { BlockProps } from './Block';

export type Value = string;

export interface NameBlockProps extends Omit<BlockProps, 'title' | 'onChange' | 'children'> {
	value?: Value;
	onChange: (value: Value) => void;
}

export const defaultValue: Value = '';

function NameBlock({ value = defaultValue, onChange, ...props }: NameBlockProps): ReactElement<NameBlockProps> {
	return (
		<Block {...props} title={gettext('Название')}>
			<Block.Body>
				<Input
					value={value}
					placeholder={gettext('Придумайте название')}
					onChange={e => onChange(e.target.value)}
				/>
			</Block.Body>
		</Block>
	);
}

export default memo(NameBlock);