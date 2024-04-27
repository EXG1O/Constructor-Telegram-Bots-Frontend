import React, { ReactElement, memo } from 'react';

import { NodeToolbar as BaseNodeToolbar } from 'reactflow';
import Button from 'react-bootstrap/Button';

export interface NodeToolbarProps {
	title: string;
	onEdit: () => void;
	onDelete: () => void;
}

function NodeToolbar({ title, onEdit, onDelete }: NodeToolbarProps): ReactElement<NodeToolbarProps> {
	return (
		<BaseNodeToolbar isVisible>
			<div className='d-flex gap-2'>
				<Button
					as='i'
					size='sm'
					variant='secondary'
					className='bi bi-pencil-square d-flex p-1'
					style={{ fontSize: '16px' }}
					onClick={onDelete}
				/>
				<span
					className='text-bg-dark rounded-1 px-2'
					style={{ cursor: 'default' }}
				>
					{title}
				</span>
				<Button
					as='i'
					size='sm'
					variant='danger'
					className='bi bi-trash d-flex p-1'
					style={{ fontSize: '16px' }}
					onClick={onEdit}
				/>
			</div>
		</BaseNodeToolbar>
	);
}

export default memo(NodeToolbar);