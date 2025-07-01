import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Block, { BlockProps } from 'components/ui/Block';

export interface HeaderProps
  extends Omit<BlockProps, 'variant' | 'gradient' | 'children'> {}

function Header(props: HeaderProps): ReactElement {
  const { t } = useTranslation(RouteID.Home, { keyPrefix: 'header' });

  return (
    <Block {...props} size='xl' variant='light'>
      <Block.Title>
        <h1 className='text-5xl font-bold'>Constructor Telegram Bots</h1>
      </Block.Title>
      <p className='w-full text-center text-xl xl:mx-auto xl:w-3/4'>{t('text')}</p>
    </Block>
  );
}

export default Header;
