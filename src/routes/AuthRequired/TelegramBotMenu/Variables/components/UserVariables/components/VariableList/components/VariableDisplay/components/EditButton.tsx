import React, { ReactElement, HTMLAttributes, memo, useState, useCallback } from 'react';
import classNames from 'classnames';

import VariableEditModal from '../../../../VariableEditModal';

import useVariable from '../../../hooks/useVariables';

export type EditButtonProps = Omit<HTMLAttributes<HTMLElement>, 'children'>;

function EditButton({ className, style, onClick, ...props }: EditButtonProps): ReactElement<EditButtonProps> {
	const { variable } = useVariable();

	const [showModal, setShowModal] = useState<boolean>(false);

	function handleClick(event: React.MouseEvent<HTMLElement>): void {
		setShowModal(true);
		onClick?.(event);
	}

	return (
		<>
			<VariableEditModal
				variable={variable}
				show={showModal}
				onHide={useCallback(() => setShowModal(false), [])}
			/>
			<i
				{...props}
				className={classNames('d-flex text-secondary bi bi-pencil-square', className)}
				style={{ fontSize: '18px', cursor: 'pointer', ...style }}
				onClick={handleClick}
			/>
		</>
	);
}

export default memo(EditButton);