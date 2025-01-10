import React, { HTMLAttributes, memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel as BasePanel } from 'reactflow';

import { RouteID } from 'routes';

import AddButton from 'components/AddButton';
import Stack from 'components/Stack';

import useCommandOffcanvasStore from './CommandOffcanvas/hooks/useCommandOffcanvasStore';
import useConditionOffcanvasStore from './ConditionOffcanvas/hooks/useConditionOffcanvasStore';

export type PanelProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

function Panel({ className, ...props }: PanelProps): ReactElement<PanelProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'panel',
	});

	const showAddCommandOffcanvas = useCommandOffcanvasStore((state) => state.showAdd);
	const showAddConditionOffcanvas = useConditionOffcanvasStore(
		(state) => state.showAdd,
	);

	return (
		<BasePanel position='top-right'>
			<Stack {...props} gap={1}>
				<AddButton size='sm' variant='dark' onClick={showAddCommandOffcanvas}>
					{t('addCommandButton')}
				</AddButton>
				<AddButton size='sm' variant='dark' onClick={showAddConditionOffcanvas}>
					{t('addConditionButton')}
				</AddButton>
			</Stack>
		</BasePanel>
	);
}

export default memo(Panel);
