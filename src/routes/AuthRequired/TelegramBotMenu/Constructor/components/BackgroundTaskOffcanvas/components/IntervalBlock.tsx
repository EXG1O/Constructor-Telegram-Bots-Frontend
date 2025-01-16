import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormSelectFeedback from 'components/FormSelectFeedback';

import Block, { BlockProps } from '../../Block';

export type Interval = 1 | 3 | 7 | 14 | 28;

export type IntervalBlockProps = Pick<BlockProps, 'className'>;

const intervals: Interval[] = [1, 3, 7, 14, 28];

export const defaultInterval: Interval = 1;

function IntervalBlock(props: IntervalBlockProps): ReactElement<IntervalBlockProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'backgroundTaskOffcanvas.intervalBlock',
	});

	return (
		<Block {...props} title={t('title')} body>
			<FormSelectFeedback name='interval'>
				{intervals.map((interval, index) => (
					<option key={index} value={interval}>
						{t(`select.${interval}`)}
					</option>
				))}
			</FormSelectFeedback>
		</Block>
	);
}

export default IntervalBlock;
