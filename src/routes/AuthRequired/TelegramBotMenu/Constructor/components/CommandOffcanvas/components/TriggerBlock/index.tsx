import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormInputFeedback from 'components/FormInputFeedback';

import DescriptionInputCollapse from './components/DescriptionInputCollapse';

import Block, { BlockProps } from '../../../Block';

export interface Trigger {
	text: string;
	description: string;
}

export type TriggerBlockProps = Pick<BlockProps, 'className'>;

export const defaultTrigger: Trigger = { text: '', description: '' };

function TriggerBlock(props: TriggerBlockProps): ReactElement<TriggerBlockProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'commandOffcanvas.triggerBlock',
	});

	return (
		<Block.Collapse name='show_trigger_block'>
			<Block {...props} title={t('title')} body>
				<FormInputFeedback
					name='trigger.text'
					placeholder={t('textInputPlaceholder')}
				/>
				<DescriptionInputCollapse>
					<FormInputFeedback
						name='trigger.description'
						placeholder={t('descriptionInputPlaceholder')}
						className='border-top-0 rounded-top-0'
					/>
				</DescriptionInputCollapse>
			</Block>
		</Block.Collapse>
	);
}

export default memo(TriggerBlock);
