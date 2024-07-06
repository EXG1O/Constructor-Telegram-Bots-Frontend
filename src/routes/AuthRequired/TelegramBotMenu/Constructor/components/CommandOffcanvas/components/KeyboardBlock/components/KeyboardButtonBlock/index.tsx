import React, { memo, ReactElement, useMemo } from 'react';
import classNames from 'classnames';

import Button, { ButtonProps } from 'react-bootstrap/Button';

import BlockCollapse from './components/BlockCollapse';
import TextInput, { defaultText, Text } from './components/TextInput';
import URLInput, { defaultURL, URL } from './components/URLInput';
import URLInputCollapse from './components/URLInputCollapse';

import Block, { BlockProps } from '../../../../../Block';

import useCommandOffcanvasStore from '../../../../hooks/useCommandOffcanvasStore';

export interface KeyboardButton {
	text: Text;
	url: URL;
}

export type KeyboardButtonBlockProps = Omit<BlockProps, 'title' | 'children'>;

export const defaultKeyboardButton: KeyboardButton = {
	text: defaultText,
	url: defaultURL,
};

export {
	defaultText as defaultKeyboardButtonText,
	defaultURL as defaultKeyboardButtonURL,
};

function KeyboardButtonBlock(
	props: KeyboardButtonBlockProps,
): ReactElement<KeyboardButtonBlockProps> {
	const type = useCommandOffcanvasStore((state) => state.keyboardButtonBlockType);
	const add = useCommandOffcanvasStore((state) => state.addKeyboardButton);
	const save = useCommandOffcanvasStore((state) => state.saveKeyboardButton);
	const _delete = useCommandOffcanvasStore((state) => state.deleteKeyboardButton);
	const hide = useCommandOffcanvasStore((state) => state.hideKeyboardButtonBlock);

	const addButtonProps = useMemo<ButtonProps>(
		() => ({ children: gettext('Добавить'), onClick: add }),
		[add],
	);
	const saveButtonProps = useMemo<ButtonProps>(
		() => ({ children: gettext('Сохранить'), onClick: save }),
		[save],
	);

	return (
		<BlockCollapse>
			<Block
				{...props}
				title={
					type == 'add'
						? gettext('Добавление кнопки')
						: gettext('Редактирование кнопки')
				}
			>
				<Block.Body>
					<TextInput />
					<URLInputCollapse>
						<URLInput />
					</URLInputCollapse>
				</Block.Body>
				<Block.Footer>
					<div className='row g-2'>
						<div className='col-6'>
							<Button
								size='sm'
								variant='success'
								className='w-100'
								{...(type === 'add' ? addButtonProps : saveButtonProps)}
							/>
						</div>
						{type === 'edit' && (
							<div className='col-6'>
								<Button
									size='sm'
									variant='danger'
									className='w-100'
									onClick={_delete}
								>
									{gettext('Удалить')}
								</Button>
							</div>
						)}
						<div
							className={classNames({
								'col-6': type === 'add',
								'col-12': type === 'edit',
							})}
						>
							<Button
								size='sm'
								variant='danger'
								className='w-100'
								onClick={hide}
							>
								{gettext('Отменить')}
							</Button>
						</div>
					</div>
				</Block.Footer>
			</Block>
		</BlockCollapse>
	);
}

export default memo(KeyboardButtonBlock);
