import React, { ReactElement } from 'react';
import { Stack } from 'react-bootstrap';

import FirstValueInput, { defaultFirstValue, FirstValue } from './FirstValueInput';
import NextPartOperatorSelect, {
	defaultNextPartOperator,
	NextPartOperator,
} from './NextPartOperatorSelect';
import OperatorSelect, { defaultOperator, Operator } from './OperatorSelect';
import SecondValueInput, { defaultSecondValue, SecondValue } from './SecondValueInput';

export interface Part {
	id?: number;
	firstValue: FirstValue;
	operator: Operator;
	secondValue: SecondValue;
	nextPartOperator: NextPartOperator;
}

export interface PartItemProps {
	index: number;
}

export const defaultPart: Part = {
	firstValue: defaultFirstValue,
	operator: defaultOperator,
	secondValue: defaultSecondValue,
	nextPartOperator: defaultNextPartOperator,
};

function PartItem({ index }: PartItemProps): ReactElement<PartItemProps> {
	return (
		<Stack direction='horizontal' gap={1}>
			<FirstValueInput size='sm' index={index} />
			<OperatorSelect size='sm' index={index} />
			<SecondValueInput size='sm' index={index} />
			<NextPartOperatorSelect size='sm' index={index} />
		</Stack>
	);
}

export default PartItem;
