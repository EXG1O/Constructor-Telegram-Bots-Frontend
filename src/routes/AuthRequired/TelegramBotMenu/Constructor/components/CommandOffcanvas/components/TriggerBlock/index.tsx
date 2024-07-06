import React, { memo, ReactElement } from 'react';

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
	return (
		<BlockCollapse>
			<Block {...props} title={gettext('Триггер')} body>
				<TextInput className='mb-2' />
				<DescriptionInputCollapse>
					<DescriptionInput />
				</DescriptionInputCollapse>
			</Block>
		</BlockCollapse>
	);
}

export default memo(TriggerBlock);
