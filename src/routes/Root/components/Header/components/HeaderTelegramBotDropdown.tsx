import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { reverse, RouteID } from 'routes';

import Button from 'components/ui/Button';
import Dropdown, { DropdownProps } from 'components/ui/Dropdown';

import { TelegramBot } from 'api/telegram_bots/types';

export interface HeaderTelegramBotDropdownProps
  extends Omit<DropdownProps, 'children'> {
  telegramBot: TelegramBot;
}

function HeaderTelegramBotDropdown({
  telegramBot,
  ...props
}: HeaderTelegramBotDropdownProps): ReactElement {
  const { t } = useTranslation(RouteID.Root, {
    keyPrefix: 'telegramBotDropdown',
  });

  return (
    <Dropdown {...props}>
      <Dropdown.Trigger asChild>
        <Button variant='dark' className='max-w-37.5'>
          <span className='truncate'>{telegramBot.username}</span>
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Menu>
        {Object.entries({
          [RouteID.TelegramBotMenu]: t('telegramBot'),
          [RouteID.TelegramBotMenuVariables]: t('variables'),
          [RouteID.TelegramBotMenuUsers]: t('users'),
          [RouteID.TelegramBotMenuDatabase]: t('database'),
          [RouteID.TelegramBotMenuConstructor]: t('constructor'),
        }).map(([routeID, text], index) => (
          <Dropdown.Menu.Item key={index} asChild>
            <Link to={reverse(routeID, { telegramBotID: telegramBot.id })}>{text}</Link>
          </Dropdown.Menu.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default HeaderTelegramBotDropdown;
