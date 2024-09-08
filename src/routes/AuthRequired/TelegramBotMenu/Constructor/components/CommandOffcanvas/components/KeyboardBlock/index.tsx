import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import AddKeyboardButtonButton from './components/AddKeyboardButtonButton';
import AddKeyboardRowButton from './components/AddKeyboardRowButton';
import BlockCollapse from './components/BlockCollapse';
import Keyboard, { KeyboardRow } from './components/Keyboard';
import KeyboardButtonBlock from './components/KeyboardButtonBlock';
import KeyboardTypeButtonGroup, {
	defaultType,
	Type,
} from './components/KeyboardTypeButtonGroup';

import Block, { BlockProps } from '../../../Block';

export interface Keyboard {
	type: Type;
	rows: KeyboardRow[];
}

export type KeyboardBlockProps = Omit<BlockProps, 'title' | 'children'>;

export const defaultKeyboard: Keyboard = { type: defaultType, rows: [] };

export { defaultType as defaultKeyboardType };

function KeyboardBlock(props: KeyboardBlockProps): ReactElement<KeyboardBlockProps> {
	const { t } = useTranslation('telegram-bot-menu-constructor', {
		keyPrefix: 'commandOffcanvas.keyboardBlock',
	});

	return (
		<BlockCollapse>
			<Block {...props} title={t('title')}>
				<Block.Body className='vstack gap-2'>
					<KeyboardTypeButtonGroup />
					<KeyboardButtonBlock />
					<Keyboard />
				</Block.Body>
				<Block.Footer className='d-flex gap-2'>
					<AddKeyboardButtonButton className='w-50' />
					<AddKeyboardRowButton className='w-50' />
				</Block.Footer>
			</Block>
		</BlockCollapse>
	);
}

export default memo(KeyboardBlock);
