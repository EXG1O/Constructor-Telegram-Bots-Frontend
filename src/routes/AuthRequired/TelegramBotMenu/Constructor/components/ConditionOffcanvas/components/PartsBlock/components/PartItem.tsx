import React, { HTMLAttributes, memo, ReactElement } from 'react';

import FormSimpleInputFeedback from 'components/shared/FormSimpleInputFeedback';
import TelegramSimpleInputLayout from 'components/shared/TelegramSimpleInputLayout';
import { SelectProps } from 'components/ui/Select';

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

const selectContainerProps: SelectProps['containerProps'] = { className: 'mt-5.75' };

function PartItem({ index, className, ...props }: PartItemProps): ReactElement {
  return (
    <div {...props} className={cn('flex', 'w-full', 'gap-1', className)}>
      <FormSimpleInputFeedback size='sm' name={`parts[${index}].first_value`}>
        <TelegramSimpleInputLayout toolbarVariables />
      </FormSimpleInputFeedback>
      <OperatorSelect index={index} containerProps={selectContainerProps} />
      <FormSimpleInputFeedback size='sm' name={`parts[${index}].second_value`}>
        <TelegramSimpleInputLayout toolbarVariables />
      </FormSimpleInputFeedback>
      <NextPartOperatorSelect index={index} containerProps={selectContainerProps} />
    </div>
  );
}

export default memo(PartItem);
