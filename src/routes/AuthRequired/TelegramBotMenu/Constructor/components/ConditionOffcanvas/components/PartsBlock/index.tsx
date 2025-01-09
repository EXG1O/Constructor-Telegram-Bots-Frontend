import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack } from 'react-bootstrap';
import { useShallow } from 'zustand/react/shallow';

import { RouteID } from 'routes';

import PartItem, { defaultPart, Part } from './components/PartItem';

import Block from '../../../Block';

import useConditionOffcanvasStore from '../../hooks/useConditionOffcanvasStore';

export type Parts = Part[];

export const defaultParts: Parts = [defaultPart];

function PartsBlock(): ReactElement {
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'conditionOffcanvas.partsBlock',
	});

	const partCount = useConditionOffcanvasStore(
		useShallow((store) => store.parts.length),
	);

	return (
		<Block title={t('title')} body>
			<Stack gap={1}>
				{Array.from({ length: partCount }).map((_, index) => (
					<PartItem key={index} index={index} />
				))}
			</Stack>
		</Block>
	);
}

export default memo(PartsBlock);
