import React, { CSSProperties, HTMLAttributes, ReactElement, memo } from 'react';
import classNames from 'classnames';

import { NodeToolbar as BaseNodeToolbar } from 'reactflow';

import Button from 'react-bootstrap/Button';

export interface NodeToolbarProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	title: string;
	onEdit: () => void;
	onDelete: () => void;
}

const titleStyle: CSSProperties = { cursor: 'default' };
const buttonStyle: CSSProperties = { fontSize: '16px' };

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
					as='i'
					size='sm'
					variant='secondary'
					className='d-flex bi bi-pencil-square p-1'
					style={buttonStyle}
					onClick={onEdit}
				/>
				<span className='text-bg-dark rounded-1 px-2' style={titleStyle}>
					{title}
				</span>
				<Button
					as='i'
					size='sm'
					variant='danger'
					className='d-flex bi bi-trash p-1'
					style={buttonStyle}
					onClick={onDelete}
				/>
			</div>
		</BaseNodeToolbar>
	);
}

export default memo(NodeToolbar);
