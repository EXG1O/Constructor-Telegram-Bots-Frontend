import React, { ReactElement, HTMLAttributes } from 'react';

import { Variable } from '..';

export interface VariableDisplayProps extends Omit<HTMLAttributes<HTMLTableRowElement>, 'children'> {
	variable: Variable;
}

function VariableDisplay({ variable, ...props }: VariableDisplayProps): ReactElement<VariableDisplayProps> {
	return (
		<tr {...props}>
			<td className='w-50'>
				<div className='d-flex gap-2'>
					<i
						className='btn-clipboard bi bi-clipboard'
						data-clipboard-text={`{{ ${variable.name} }}`}
						style={{ cursor: 'pointer' }}
					/>
					<span className='flex-fill text-info-emphasis'>{variable.name}</span>
				</div>
			</td>
			<td className='text-nowrap'>{variable.description}</td>
		</tr>
	);
}

export default VariableDisplay;