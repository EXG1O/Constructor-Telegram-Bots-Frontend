import React, { type HTMLAttributes, type ReactElement } from 'react';

import List from 'components/ui/List';

import SelectButton from './SelectButton';

import cn from 'utils/cn';

export interface OtherVariablesProps extends Omit<
  HTMLAttributes<HTMLUListElement>,
  'children'
> {}

const variables: string[] = ['API_RESPONSE', 'WEBHOOK_PAYLOAD'];

function OtherVariables({ className, ...props }: OtherVariablesProps): ReactElement {
  return (
    <List size='sm' striped>
      <ul
        {...props}
        className={cn('w-full', 'rounded-sm', 'text-sm', 'overflow-hidden', className)}
      >
        {variables.map((variable) => (
          <List.Item key={variable} className='flex gap-1'>
            <span className='flex-auto'>{variable}</span>
            <SelectButton variable={variable} />
          </List.Item>
        ))}
      </ul>
    </List>
  );
}

export default OtherVariables;
