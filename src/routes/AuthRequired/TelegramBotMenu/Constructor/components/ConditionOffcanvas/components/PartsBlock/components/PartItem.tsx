import React, { ReactElement } from 'react';
import { Stack } from 'react-bootstrap';

import FormInputFeedback from 'components/FormInputFeedback';

import NextPartOperatorSelect, {
	defaultNextPartOperator,
	NextPartOperator,
} from './NextPartOperatorSelect';
import OperatorSelect, { defaultOperator, Operator } from './OperatorSelect';

export interface Part {
	id?: number;
	type: '-' | '+';
	first_value: string;
	operator: Operator;
	second_value: string;
	next_part_operator: NextPartOperator;
}

export interface PartItemProps {
	index: number;
}

export const defaultPart: Part = {
	type: '+',
	first_value: '',
	operator: defaultOperator,
	second_value: '',
	next_part_operator: defaultNextPartOperator,
};

function PartItem({ index }: PartItemProps): ReactElement<PartItemProps> {
	return (
		<Stack direction='horizontal' gap={1}>
			<FormInputFeedback size='sm' name={`parts[${index}].first_value`} />
			<OperatorSelect size='sm' index={index} />
			<FormInputFeedback size='sm' name={`parts[${index}].second_value`} />
			<NextPartOperatorSelect size='sm' index={index} />
		</Stack>
	);
}

export default PartItem;
