import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import { Stack } from 'react-bootstrap';

import { RouteID } from 'routes';

import PartItem, { defaultPart, Part } from './components/PartItem';

import Block from '../../../Block';
import VariablesInfoText from '../../../VariablesInfoText';

export type Parts = Part[];

export const defaultParts: Parts = [defaultPart];

function PartsBlock(): ReactElement {
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'conditionOffcanvas.partsBlock',
	});

	const [{ value: parts }] = useField<Parts>('parts');

	return (
		<Block title={t('title')} body>
			<Stack gap={1}>
				{parts.map((_, index) => (
					<PartItem key={index} index={index} />
				))}
				<VariablesInfoText />
			</Stack>
		</Block>
	);
}

export default memo(PartsBlock);
