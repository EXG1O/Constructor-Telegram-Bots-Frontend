import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import { RouteID } from 'routes';

import Block, { BlockProps } from 'components/ui/Block';
import Tabs from 'components/ui/Tabs';

import { Method } from 'api/telegram-bots/api-request/types';

import cn from 'utils/cn';

export type { Method };

export interface MethodBlockFormValues {
  method: Method;
}

export interface MethodBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

const methods: Method[] = ['get', 'post', 'put', 'patch', 'delete'];

export const defaultMethod: Method = 'get';
export const defaultMethodBlockFormValues: MethodBlockFormValues = {
  method: defaultMethod,
};

function MethodBlock({ className, ...props }: MethodBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'apiRequestOffcanvas.methodBlock',
  });

  const [{ value }, _meta, { setValue }] = useField<Method>('method');

  function handleChange(value: string): void {
    setValue(value as Method);
  }

  return (
    <Block
      {...props}
      variant='light'
      className={cn('flex', 'flex-col', 'gap-2', className)}
    >
      <Block.Title>
        <h3 className='text-lg font-medium'>{t('title')}</h3>
      </Block.Title>
      <Tabs size='sm' value={value} onChange={handleChange}>
        {methods.map((method, index) => (
          <Tabs.Button key={index} value={method}>
            {method.toUpperCase()}
          </Tabs.Button>
        ))}
      </Tabs>
    </Block>
  );
}

export default MethodBlock;
