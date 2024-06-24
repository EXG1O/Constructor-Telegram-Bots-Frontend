import React, {
	ReactElement,
	HTMLAttributes,
	memo,
	useState,
	useCallback,
} from 'react';

import classNames from 'classnames';

import PencilSquareIcon from 'assets/icons/pencil-square.svg';

import VariableEditModal from '../../../../VariableEditModal';

import useVariable from '../../../hooks/useVariables';

export type EditButtonProps = Omit<HTMLAttributes<SVGSVGElement>, 'children'>;

function EditButton({
	className,
	style,
	onClick,
	...props
}: EditButtonProps): ReactElement<EditButtonProps> {
	const { variable } = useVariable();

	const [showModal, setShowModal] = useState<boolean>(false);

	function handleClick(event: React.MouseEvent<SVGSVGElement>): void {
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
			<PencilSquareIcon
				{...props}
				width={18}
				height='100%'
				className={classNames('text-secondary', className)}
				style={{ cursor: 'pointer', ...style }}
				onClick={handleClick}
			/>
		</>
	);
}

export default memo(EditButton);
