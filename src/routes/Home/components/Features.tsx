import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import type { RouteID } from 'routes';

import Block, { type BlockProps } from 'components/ui/Block';
import List from 'components/ui/List';

export interface FeaturesProps extends Omit<
  BlockProps,
  'size' | 'variant' | 'gradient' | 'children'
> {}

const names: string[] = ['modularity', 'freeLimits', 'userRespect', 'openSource'];

function Features(props: FeaturesProps): ReactElement {
  const { t } = useTranslation<`${RouteID.Home}`, any>('home', {
    keyPrefix: 'features',
  });

  return (
    <Block {...props} size='xl' variant='primary' gradient>
      <Block.Title>
        <h3 className='mb-3 text-3xl font-semibold'>{t('title')}</h3>
      </Block.Title>
      <List striped>
        <ul className='w-full'>
          {names.map((name) => (
            <List.Item
              key={name}
              className='flex flex-col gap-0.75 rounded-lg px-2.5 py-1.5'
            >
              <h4 className='w-full text-lg font-medium'>{t(`${name}.title`)}</h4>
              <p className='w-full leading-snug'>{t(`${name}.description`)}</p>
            </List.Item>
          ))}
        </ul>
      </List>
    </Block>
  );
}

export default Features;
