import React, { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { RouteID } from 'routes';

import Button from 'components/ui/Button';
import Dropdown, { DropdownProps } from 'components/ui/Dropdown';

import StatsModal from './components/StatsModal';
import TelegramBotModal from './components/TelegramBotModal';

import { TelegramBot } from 'api/telegram-bots/telegram-bot/types';

import reverse from 'utils/reverse';

export interface TelegramBotDropdownProps extends Omit<DropdownProps, 'children'> {
  telegramBot: TelegramBot;
}

function TelegramBotDropdown({
  telegramBot,
  ...props
}: TelegramBotDropdownProps): ReactElement {
  const { t } = useTranslation(RouteID.Root, {
    keyPrefix: 'header.telegramBotDropdown',
  });

  const [showTelegramBotModal, setShowTelegramBotModal] = useState<boolean>(false);
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);

  function handleTelegramBotModalHide(): void {
    setShowTelegramBotModal(false);
  }

  function handleTelegramBotSelect(): void {
    setShowTelegramBotModal(true);
  }

  function handleStatsModalHide(): void {
    setShowStatsModal(false);
  }

  function handleStatsSelect(): void {
    setShowStatsModal(true);
  }

  return (
    <>
      <TelegramBotModal
        show={showTelegramBotModal}
        onHide={handleTelegramBotModalHide}
      />
      <StatsModal show={showStatsModal} onHide={handleStatsModalHide} />
      <Dropdown {...props}>
        <Dropdown.Trigger asChild>
          <Button variant='dark' className='max-w-37.5'>
            <span className='truncate'>{telegramBot.username}</span>
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Menu hideWhenDetached>
          <Dropdown.Menu.Item onSelect={handleTelegramBotSelect}>
            {t('telegramBot')}
          </Dropdown.Menu.Item>
          <Dropdown.Menu.Item onSelect={handleStatsSelect}>
            {t('stats')}
          </Dropdown.Menu.Item>
          {Object.entries({
            [RouteID.TelegramBotMenuVariables]: t('variables'),
            [RouteID.TelegramBotMenuUsers]: t('users'),
            [RouteID.TelegramBotMenuDatabase]: t('database'),
            [RouteID.TelegramBotMenuConstructor]: t('constructor'),
          }).map(([routeID, text], index) => (
            <Dropdown.Menu.Item key={index} asChild>
              <Link to={reverse(routeID, { telegramBotID: telegramBot.id })}>
                {text}
              </Link>
            </Dropdown.Menu.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}

export default TelegramBotDropdown;
