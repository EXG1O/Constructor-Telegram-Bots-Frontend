import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Block, { BlockProps } from 'components/ui/Block';

import cn from 'utils/cn';

export interface HeaderProps
  extends Omit<BlockProps, 'variant' | 'gradient' | 'children'> {}

function Header({ className, ...props }: HeaderProps): ReactElement {
  const { t } = useTranslation(RouteID.Home, { keyPrefix: 'header' });

  return (
    <Block
      {...props}
      variant='light'
      className={cn('text-foreground', 'text-center', className)}
    >
      <h1 className='text-5xl font-bold'>Constructor Telegram Bots</h1>
      <p className='w-full text-xl xl:mx-auto xl:w-3/4'>{t('text')}</p>
    </Block>
  );
}

export default Header;
