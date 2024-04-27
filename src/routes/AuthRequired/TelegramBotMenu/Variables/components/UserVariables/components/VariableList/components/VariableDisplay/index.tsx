import React, { ReactElement, HTMLAttributes, memo } from 'react';

import EditButton from './components/EditButton';
import DeleteButton from './components/DeleteButton';

import useVariable from '../../hooks/useVariables';

export type VariableDisplayProps = Omit<HTMLAttributes<HTMLTableRowElement>, 'children'>;

function VariableDisplay(props: VariableDisplayProps): ReactElement<VariableDisplayProps> {
	const { variable } = useVariable();

	return(
		<tr {...props}>
			<td className='w-50'>
				<div className='d-flex gap-2'>
					<i
						className='btn-clipboard bi bi-clipboard'
						data-clipboard-text={`{{ ${variable.name} }}`}
						style={{ cursor: 'pointer' }}
					/>
					<span className='flex-fill text-info-emphasis'>
						{variable.name}
					</span>
				</div>
			</td>
			<td>
				<div className='d-flex gap-2'>
					<span className='flex-fill text-nowrap'>
						{variable.description}
					</span>
					<div className='d-flex'>
						<EditButton className='my-auto' />
						<DeleteButton
							className='my-auto'
							style={{ marginLeft: '5.5px' }}
						/>
					</div>
				</div>
			</td>
		</tr>
	);
}

export default memo(VariableDisplay);