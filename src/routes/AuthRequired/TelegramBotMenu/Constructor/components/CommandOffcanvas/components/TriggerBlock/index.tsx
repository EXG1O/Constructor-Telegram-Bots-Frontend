import React, { ReactElement, memo } from 'react';

import Block, { BlockProps } from '../../../Block';

import BlockCollapse from './components/BlockCollapse';
import DescriptionInput, {
	Description,
	defaultDescription,
} from './components/DescriptionInput';
import DescriptionInputCollapse from './components/DescriptionInputCollapse';
import TextInput, { Text, defaultText } from './components/TextInput';

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
	defaultText as defaultTriggerText,
	defaultDescription as defaultTriggerDescription,
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
