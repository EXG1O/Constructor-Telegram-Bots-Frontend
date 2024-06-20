import React, { CSSProperties, HTMLAttributes, ReactElement, memo } from 'react';
import classNames from 'classnames';

import PencilSquareIcon from 'assets/icons/pencil-square.svg';
import TrashIcon from 'assets/icons/trash.svg';

import { NodeToolbar as BaseNodeToolbar } from 'reactflow';

import Button from 'react-bootstrap/Button';

export interface NodeToolbarProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	title: string;
	onEdit: React.MouseEventHandler<HTMLButtonElement>;
	onDelete: React.MouseEventHandler<HTMLButtonElement>;
}

const titleStyle: CSSProperties = {
	cursor: 'default',
	userSelect: 'none',
	WebkitUserSelect: 'none',
	padding: '2px 0',
};

function NodeToolbar({
	title,
	className,
	onEdit,
	onDelete,
	...props
}: NodeToolbarProps): ReactElement<NodeToolbarProps> {
	return (
		<BaseNodeToolbar isVisible>
			<div {...props} className={classNames('d-flex gap-2', className)}>
				<Button
					size='sm'
					variant='secondary'
					className='d-flex p-1'
					onClick={onEdit}
				>
					<PencilSquareIcon width={18} height={18} />
				</Button>
				<span className='text-bg-dark rounded-1 px-2' style={titleStyle}>
					{title}
				</span>
				<Button
					size='sm'
					variant='danger'
					className='d-flex p-1'
					onClick={onDelete}
				>
					<TrashIcon width={18} height={18} />
				</Button>
			</div>
		</BaseNodeToolbar>
	);
}

export default memo(NodeToolbar);
