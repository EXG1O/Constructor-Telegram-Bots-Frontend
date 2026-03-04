import React, { type HTMLAttributes, memo, type ReactElement } from 'react';

import FormSimpleInputFeedback from 'components/shared/FormSimpleInputFeedback';
import TelegramSimpleInputLayout from 'components/shared/TelegramSimpleInputLayout';
import type { SelectProps } from 'components/ui/Select';

import NextPartOperatorSelect from '../NextPartOperatorSelect';
import OperatorSelect from '../OperatorSelect';

import cn from 'utils/cn';

export interface PartItemProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  index: number;
}

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
