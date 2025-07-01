import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { reverse, RouteID } from 'routes';

import TelegramBotBlock, {
  TelegramBotBlockProps,
} from 'components/shared/TelegramBotBlock';
import Button from 'components/ui/Button';

export interface TelegramBotItemProps extends Omit<TelegramBotBlockProps, 'children'> {}

function TelegramBotItem({
  telegramBot,
  ...props
}: TelegramBotItemProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBots);

  return (
    <TelegramBotBlock {...props} telegramBot={telegramBot}>
      <Button asChild variant='dark'>
        <Link
          to={reverse(RouteID.TelegramBotMenu, {
            telegramBotID: telegramBot.id,
          })}
        >
          {t('telegramBotMenuLink')}
        </Link>
      </Button>
    </TelegramBotBlock>
  );
}

export default TelegramBotItem;
