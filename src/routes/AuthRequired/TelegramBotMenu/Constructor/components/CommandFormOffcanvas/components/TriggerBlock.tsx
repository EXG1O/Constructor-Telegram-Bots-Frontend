import React, { ReactElement, memo } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

import Block, { BlockProps } from '../../Block';

export interface Trigger {
	text: string;
	description?: string;
}

export interface TriggerBlockProps extends Omit<BlockProps, 'title' | 'onChange' | 'children'> {
	trigger?: Trigger;
	onChange: (trigger: Trigger) => void;
}

export const defaultTrigger: Trigger = { text: '' };

function TriggerBlock({ trigger = defaultTrigger, onChange, ...props }: TriggerBlockProps): ReactElement<TriggerBlockProps> {
	return (
		<Block {...props} title={gettext('Триггер')}>
			<Block.Body>
				<Form.Control
					className='mb-2'
					value={trigger.text}
					placeholder={gettext('Введите текст')}
					onChange={e => onChange({ ...trigger, text: e.target.value })}
				/>
				<Button
					size='sm'
					{...(
						trigger?.description === undefined ? {
							variant: 'dark',
							className: 'w-100',
							children: gettext('Добавить в меню'),
							onClick: () => onChange({ ...trigger, description: '' }),
						} : {
							variant: 'secondary',
							className: 'w-100 border-bottom-0 rounded rounded-bottom-0',
							children: gettext('Убрать из меню'),
							onClick: () => onChange({ ...trigger, description: undefined }),
						}
					)}
				/>
				<Collapse in={trigger?.description !== undefined} unmountOnExit>
					<div>
						<Form.Control
							value={trigger.description ?? ''}
							className='border-top-0 rounded-top-0'
							placeholder={gettext('Введите описание')}
							onChange={e => onChange({ ...trigger, description: e.target.value })}
						/>
					</div>
				</Collapse>
			</Block.Body>
		</Block>
	);
}

export default memo(TriggerBlock);