import React, { ChangeEvent, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import { produce } from 'immer';

import { RouteID } from 'routes';

import { Parts } from '..';

import Select, { SelectProps } from 'components/Select';

import { defaultPart, Part } from './PartItem';

export type NextPartOperator = '&&' | '||' | 'null';

export interface NextPartOperatorSelectProps
	extends Pick<SelectProps, 'size' | 'className'> {
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

	const [{ value: parts }, _meta, { setValue }] = useField<Parts>('parts');

	function handleChange(event: ChangeEvent<HTMLSelectElement>) {
		setValue(
			produce(parts, (draft) => {
				const part: Part = draft[index];
				const operator = event.target.value as NextPartOperator;

				if (operator === 'null') {
					draft.splice(draft.length - 1, 1);
				} else if (part.next_part_operator === 'null') {
					draft.push(defaultPart);
				}

				part.next_part_operator = operator;
			}),
		);
	}

	return (
		<Select
			{...props}
			value={parts[index].next_part_operator}
			onChange={handleChange}
		>
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
