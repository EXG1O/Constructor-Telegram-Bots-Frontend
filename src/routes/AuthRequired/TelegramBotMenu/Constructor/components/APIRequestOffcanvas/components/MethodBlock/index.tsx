import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import type { RouteID } from 'routes';

import FormTabs from 'components/shared/FormTabs';
import Block, { type BlockProps } from 'components/ui/Block';
import Tabs from 'components/ui/Tabs';

import cn from 'utils/cn';

import { Method } from './enums';

export interface MethodBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

function MethodBlock({ className, ...props }: MethodBlockProps): ReactElement {
  const { t } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'apiRequestOffcanvas.methodBlock' },
  );

  return (
    <Block
      {...props}
      variant='light'
      className={cn('flex', 'flex-col', 'gap-2', className)}
    >
      <Block.Title>
        <h3 className='text-lg font-medium'>{t('title')}</h3>
      </Block.Title>
      <FormTabs name='method' size='sm'>
        {Object.values(Method).map((method, index) => (
          <Tabs.Button key={index} value={method}>
            {method.toUpperCase()}
          </Tabs.Button>
        ))}
      </FormTabs>
    </Block>
  );
}

export default MethodBlock;
