import React, { HTMLAttributes, ReactElement } from 'react';

import FormInputFeedback from 'components/shared/FormInputFeedback';

import NextPartOperatorSelect, {
  defaultNextPartOperator,
  NextPartOperator,
} from './NextPartOperatorSelect';
import OperatorSelect, { defaultOperator, Operator } from './OperatorSelect';

import cn from 'utils/cn';

export interface Part {
  id?: number;
  type: '-' | '+';
  first_value: string;
  operator: Operator;
  second_value: string;
  next_part_operator: NextPartOperator;
}

export interface PartItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  index: number;
}

export const defaultPart: Part = {
  type: '+',
  first_value: '',
  operator: defaultOperator,
  second_value: '',
  next_part_operator: defaultNextPartOperator,
};

function PartItem({ index, className, ...props }: PartItemProps): ReactElement {
  return (
    <div {...props} className={cn('flex', 'gap-1', className)}>
      <FormInputFeedback size='sm' name={`parts[${index}].first_value`} />
      <OperatorSelect index={index} />
      <FormInputFeedback size='sm' name={`parts[${index}].second_value`} />
      <NextPartOperatorSelect index={index} />
    </div>
  );
}

export default PartItem;
