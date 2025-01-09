import React, { ChangeEvent, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';

import { RouteID } from 'routes';

import Select, { SelectProps } from 'components/Select';

import { defaultPart, Part } from './PartItem';

import useConditionOffcanvasStore from '../../../hooks/useConditionOffcanvasStore';

export type NextPartOperator = '&&' | '||' | 'null';

export interface NextPartOperatorSelectProps
	extends Omit<SelectProps, 'defaultValue' | 'value' | 'onChange'> {
	index: number;
}

const nextPartOperators: NextPartOperator[] = ['&&', '||'];

export const defaultNextPartOperator: NextPartOperator = 'null';

function NextPartOperatorSelect({
	index,
	...props
}: NextPartOperatorSelectProps): ReactElement<NextPartOperatorSelectProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'conditionOffcanvas.partsBlock.nextPartOperatorSelect',
	});

	const nextPartOperator = useConditionOffcanvasStore(
		useShallow((store) => store.parts[index].nextPartOperator),
	);
	const updateParts = useConditionOffcanvasStore((store) => store.updateParts);

	function handleChange(event: ChangeEvent<HTMLSelectElement>) {
		updateParts((parts) => {
			const part: Part = parts[index];
			const operator = event.target.value as NextPartOperator;

			if (operator === 'null') {
				parts.splice(parts.length - 1, 1);
			} else if (part.nextPartOperator === 'null') {
				parts.push(defaultPart);
			}

			part.nextPartOperator = operator;
		});
	}

	return (
		<Select {...props} value={nextPartOperator} onChange={handleChange}>
			<option value='null'>-</option>
			{nextPartOperators.map((nextPartOperator, index) => (
				<option key={index} value={nextPartOperator}>
					{t(nextPartOperator)}
				</option>
			))}
		</Select>
	);
}

export default NextPartOperatorSelect;
