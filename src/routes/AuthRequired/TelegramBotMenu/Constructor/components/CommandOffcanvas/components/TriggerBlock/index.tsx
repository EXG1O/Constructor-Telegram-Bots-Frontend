import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import BlockCollapse from './components/BlockCollapse';
import DescriptionInput, {
	defaultDescription,
	Description,
} from './components/DescriptionInput';
import DescriptionInputCollapse from './components/DescriptionInputCollapse';
import TextInput, { defaultText, Text } from './components/TextInput';

import Block, { BlockProps } from '../../../Block';

export interface Trigger {
	text: Text;
	description: Description;
}

export type TriggerBlockProps = Omit<BlockProps, 'title' | 'children'>;

export const defaultTrigger: Trigger = {
	text: defaultText,
	description: defaultDescription,
};

export {
	defaultDescription as defaultTriggerDescription,
	defaultText as defaultTriggerText,
};

function TriggerBlock(props: TriggerBlockProps): ReactElement<TriggerBlockProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'commandOffcanvas.triggerBlock',
	});

	return (
		<BlockCollapse>
			<Block {...props} title={t('title')} body>
				<TextInput className='mb-2' />
				<DescriptionInputCollapse>
					<DescriptionInput />
				</DescriptionInputCollapse>
			</Block>
		</BlockCollapse>
	);
}

export default memo(TriggerBlock);
