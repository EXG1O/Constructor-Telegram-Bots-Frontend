import React, { ReactElement, HTMLAttributes, memo } from 'react';

import classNames from 'classnames';

import { Panel as BasePanel } from 'reactflow';

import AddButton from 'components/AddButton';

import useCommandOffcanvasStore from './CommandOffcanvas/hooks/useCommandOffcanvasStore';

export type PanelProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

function Panel({ className, ...props }: PanelProps): ReactElement<PanelProps> {
	const showAddCommandOffcanvas = useCommandOffcanvasStore((state) => state.showAdd);

	return (
		<BasePanel position='top-right'>
			<div
				{...props}
				className={classNames(
					'vstack bg-light border rounded-1 gap-1 p-1',
					className,
				)}
			>
				<AddButton size='sm' variant='dark' onClick={showAddCommandOffcanvas}>
					{gettext('Добавить команду')}
				</AddButton>
			</div>
		</BasePanel>
	);
}

export default memo(Panel);
