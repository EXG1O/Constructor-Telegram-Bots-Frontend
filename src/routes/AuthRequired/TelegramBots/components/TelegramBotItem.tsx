import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { reverse, RouteID } from 'routes';

import TelegramBotContent, {
  TelegramBotContentProps,
} from 'components/shared/TelegramBotContent';
import Block, { BlockProps } from 'components/ui/Block';
import Button from 'components/ui/Button';

import cn from 'utils/cn';

export interface TelegramBotItemProps
  extends Omit<BlockProps, 'variant' | 'children'>,
    Pick<TelegramBotContentProps, 'telegramBot'> {}

function TelegramBotItem({
  telegramBot,
  className,
  ...props
}: TelegramBotItemProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBots);

  return (
    <Block
      {...props}
      variant='light'
      className={cn('flex', 'flex-col', 'gap-1', className)}
    >
      <Block.Title>
        <h4 className='text-2xl font-semibold'>
          <a
            href={`https://t.me/${telegramBot.username}`}
            rel='noreferrer'
            target='_blank'
          >
            {telegramBot.username}
          </a>
        </h4>
      </Block.Title>
      <TelegramBotContent telegramBot={telegramBot} />
      <Button asChild variant='dark'>
        <Link
          to={reverse(RouteID.TelegramBotMenuConstructor, {
            telegramBotID: telegramBot.id,
          })}
        >
          {t('telegramBotMenuLink')}
        </Link>
      </Button>
    </Block>
  );
}

export default TelegramBotItem;
