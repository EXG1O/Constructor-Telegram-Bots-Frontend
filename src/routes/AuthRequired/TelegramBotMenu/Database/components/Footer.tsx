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

  const recordCount = useDatabaseRecordsStore((state) => state.count);

  return recordCount ? (
    <small
      {...props}
      className={cn('w-full', 'text-end', 'text-xs', 'text-muted', className)}
    >
      {t('recordCount', { count: recordCount })}
    </small>
  ) : null;
}

export default Footer;
