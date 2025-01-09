import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';

import { RouteID } from 'routes';

import Select, { SelectProps } from 'components/Select';

import useConditionOffcanvasStore from '../../../hooks/useConditionOffcanvasStore';

export type Operator = '==' | '!=' | '>' | '>=' | '<' | '<=';

export interface OperatorSelectProps
	extends Omit<SelectProps, 'defaultValue' | 'value' | 'onChange'> {
	index: number;
}

const operators: Operator[] = ['==', '!=', '>', '>=', '<', '<='];

export const defaultOperator: Operator = '==';

function OperatorSelect({
	index,
	...props
}: OperatorSelectProps): ReactElement<OperatorSelectProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'conditionOffcanvas.partsBlock.operatorSelect',
	});

	const operator = useConditionOffcanvasStore(
		useShallow((store) => store.parts[index].operator),
	);
	const updateParts = useConditionOffcanvasStore((store) => store.updateParts);

	return (
		<Select
			{...props}
			value={operator}
			className='text-truncate'
			onChange={(e) =>
				updateParts((parts) => {
					parts[index].operator = e.target.value as Operator;
				})
			}
		>
			{operators.map((operator, index) => (
				<option key={index} value={operator}>
					{t(operator)}
				</option>
			))}
		</Select>
	);
}

export default OperatorSelect;
