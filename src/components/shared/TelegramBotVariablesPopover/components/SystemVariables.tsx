import React, { HTMLAttributes, ReactElement, useState } from 'react';
import telegramBotSystemVariables, {
  TelegramBotSystemVariablesType,
} from 'constants/telegramBotSystemVariables';

import TelegramBotSystemVariablesTypeTabs from 'components/shared/TelegramBotSystemVariablesTypeTabs';
import List from 'components/ui/List';

import SelectButton from './SelectButton';

import cn from 'utils/cn';

export interface SystemVariablesProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

function SystemVariables({ className, ...props }: SystemVariablesProps): ReactElement {
  const [type, setType] = useState<TelegramBotSystemVariablesType>('personal');

  return (
    <div {...props} className={cn('flex', 'flex-col', 'w-full', 'gap-1.5', className)}>
      <TelegramBotSystemVariablesTypeTabs size='sm' type={type} onChange={setType} />
      <List size='sm' striped>
        <ul className='w-full overflow-hidden rounded-sm text-sm'>
          {telegramBotSystemVariables[type].map((variable) => (
            <List.Item key={variable} className='flex gap-1'>
              <span className='flex-auto'>{variable}</span>
              <SelectButton variable={variable} />
            </List.Item>
          ))}
        </ul>
      </List>
    </div>
  );
}

export default SystemVariables;
