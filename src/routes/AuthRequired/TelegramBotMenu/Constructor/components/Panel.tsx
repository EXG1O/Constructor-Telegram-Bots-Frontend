import React, { HTMLAttributes, memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel as BasePanel } from 'reactflow';
import classNames from 'classnames';

import { RouteID } from 'routes';

import AddButton from 'components/AddButton';

import useCommandOffcanvasStore from './CommandOffcanvas/hooks/useCommandOffcanvasStore';

export type PanelProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

function Panel({ className, ...props }: PanelProps): ReactElement<PanelProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'panel',
	});

	const showAddCommandOffcanvas = useCommandOffcanvasStore((state) => state.showAdd);

	return (
		<BasePanel position='top-right'>
			<div {...props} className={classNames('vstack gap-1', className)}>
				<AddButton size='sm' variant='dark' onClick={showAddCommandOffcanvas}>
					{t('addCommandButton')}
				</AddButton>
			</div>
		</BasePanel>
	);
}

export default memo(Panel);
