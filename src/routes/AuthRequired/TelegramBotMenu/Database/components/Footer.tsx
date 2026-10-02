import React, { type HTMLAttributes, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import type { RouteID } from 'routes';

import useDatabaseRecordsStore from '../hooks/useDatabaseRecordsStore';

import cn from 'utils/cn';

export interface FooterProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {}

function Footer({ className, ...props }: FooterProps): ReactElement | null {
  const { t } = useTranslation<`${RouteID.TelegramBotMenuDatabase}`, any>(
    'telegram-bot-menu-database',
    { keyPrefix: 'footer' },
  );

  const count = useDatabaseRecordsStore((state) => state.count);

  return count ? (
    <small
      {...props}
      className={cn('w-full', 'text-end', 'text-xs', 'text-muted', className)}
    >
      {t('count', { count })}
    </small>
  ) : null;
}

export default Footer;
