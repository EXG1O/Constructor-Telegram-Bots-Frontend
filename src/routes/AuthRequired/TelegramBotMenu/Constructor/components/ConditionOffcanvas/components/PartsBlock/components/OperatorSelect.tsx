import React, { ChangeEvent, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import { RouteID } from 'routes';

import Select, { SelectProps } from 'components/Select';

export type Operator = '==' | '!=' | '>' | '>=' | '<' | '<=';

export interface OperatorSelectProps extends Pick<SelectProps, 'size' | 'className'> {
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

	const [{ value }, _meta, { setValue }] = useField<Operator>(
		`parts[${index}].operation`,
	);

	function handleChange(event: ChangeEvent<HTMLSelectElement>): void {
		setValue(event.target.value as Operator);
	}

	return (
		<Select
			{...props}
			value={value}
			className='text-truncate'
			onChange={handleChange}
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
