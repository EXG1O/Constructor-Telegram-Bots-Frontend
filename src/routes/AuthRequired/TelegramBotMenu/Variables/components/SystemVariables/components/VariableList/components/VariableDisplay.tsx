import React, { CSSProperties, HTMLAttributes, ReactElement } from 'react';

import { Variable } from '..';

import ClipboardIcon from 'assets/icons/clipboard.svg';

export interface VariableDisplayProps
	extends Omit<HTMLAttributes<HTMLTableRowElement>, 'children'> {
	variable: Variable;
}

const iconStyle: CSSProperties = { cursor: 'pointer' };

function VariableDisplay({
	variable,
	...props
}: VariableDisplayProps): ReactElement<VariableDisplayProps> {
	return (
		<tr {...props}>
			<td className='w-50'>
				<div className='d-flex align-items-center gap-2'>
					<ClipboardIcon
						className='btn-clipboard'
						data-clipboard-text={`{{ ${variable.name} }}`}
						style={iconStyle}
					/>
					<span className='flex-fill text-info-emphasis'>
						{variable.name}
					</span>
				</div>
			</td>
			<td className='text-nowrap'>{variable.description}</td>
		</tr>
	);
}

export default VariableDisplay;
