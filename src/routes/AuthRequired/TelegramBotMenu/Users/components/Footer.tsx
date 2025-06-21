import React, { HTMLAttributes, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import useUsersStore from '../hooks/useUsersStore';

import cn from 'utils/cn';

export interface FooterProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {}

function Footer({ className, ...props }: FooterProps): ReactElement | null {
  const { t } = useTranslation(RouteID.TelegramBotMenuUsers, {
    keyPrefix: 'footer',
  });

  const userCount = useUsersStore((state) => state.count);

  return userCount ? (
    <small
      {...props}
      className={cn('w-full', 'text-end', 'text-xs', 'text-muted', className)}
    >
      {t('userCount', { count: userCount })}
    </small>
  ) : null;
}

export default Footer;
