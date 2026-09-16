import React, { type HTMLAttributes, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import type { RouteID } from 'routes';

import cn from 'utils/cn';

import { useChatsBlockStore } from '../store';

export interface BlockFooterProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'children'
> {}

function BlockFooter({ className, ...props }: BlockFooterProps): ReactElement | null {
  const { t } = useTranslation<`${RouteID.TelegramBotMenuUsers}`, any>(
    'telegram-bot-menu-users',
    { keyPrefix: 'chatsBlock.footer' },
  );

  const count = useChatsBlockStore((state) => state.count);

  return count ? (
    <small
      {...props}
      className={cn('w-full', 'text-end', 'text-xs', 'text-muted', className)}
    >
      {t('count', { count })}
    </small>
  ) : null;
}

export default BlockFooter;
