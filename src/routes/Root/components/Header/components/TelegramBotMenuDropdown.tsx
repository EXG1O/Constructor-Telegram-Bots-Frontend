import React, { memo, ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { reverse, RouteID } from 'routes';

import Dropdown, { DropdownProps } from 'components/ui/Dropdown';

import { TelegramBot } from 'api/telegram_bots/types';
import Button from 'components/ui/Button';

export interface TelegramBotMenuDropdownProps extends Omit<DropdownProps, 'children'> {
  telegramBot: TelegramBot;
}

function TelegramBotMenuDropdown({
  telegramBot,
  ...props
}: TelegramBotMenuDropdownProps): ReactElement<TelegramBotMenuDropdownProps> {
  const { t, i18n } = useTranslation(RouteID.Root, {
    keyPrefix: 'telegramBotMenuDropdown',
  });

  const params = useMemo(() => ({ telegramBotID: telegramBot.id }), [telegramBot.id]);
  const links = useMemo(
    () => ({
      [RouteID.TelegramBotMenu]: t('telegramBot'),
      [RouteID.TelegramBotMenuVariables]: t('variables'),
      [RouteID.TelegramBotMenuUsers]: t('users'),
      [RouteID.TelegramBotMenuDatabase]: t('database'),
      [RouteID.TelegramBotMenuConstructor]: t('constructor'),
    }),
    [i18n.language],
  );

  return (
    <Dropdown {...props}>
      <Dropdown.Trigger asChild>
        <Button variant='dark' className='max-w-[150px]'>
          <span className='truncate'>{telegramBot.username}</span>
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Menu>
        {Object.entries(links).map(([routeID, text], index) => (
          <Dropdown.Menu.Item key={index} asChild>
            <Link to={reverse(routeID, params)}>{text}</Link>
          </Dropdown.Menu.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default memo(TelegramBotMenuDropdown);
