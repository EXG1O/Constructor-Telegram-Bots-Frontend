import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Slot } from '@radix-ui/react-slot';
import formatDate from 'i18n/formatDate';

import TelegramBotStorage from 'components/shared/TelegramBotStorage';
import Block, { BlockProps } from 'components/ui/Block';
import Table from 'components/ui/Table';
import { createMessageToast } from 'components/ui/ToastContainer';

import APITokenDisplay from './components/APITokenDisplay';
import APITokenEditing from './components/APITokenEditing';
import PrivateSwitch from './components/PrivateSwitch';
import TelegramBotContext from './contexts/TelegramBotContext';

import { TelegramBotAPI } from 'api/telegram_bots/main';
import { TelegramBot } from 'api/telegram_bots/types';

import cn from 'utils/cn';

export interface TelegramBotBlockProps extends Omit<BlockProps, 'variant'> {
  telegramBot: TelegramBot;
}

function TelegramBotBlock({
  telegramBot: initialTelegramBot,
  className,
  children,
  ...props
}: TelegramBotBlockProps): ReactElement {
  const { t } = useTranslation('components', { keyPrefix: 'telegramBotBlock' });

  const [telegramBot, setTelegramBot] = useState<TelegramBot>(initialTelegramBot);
  const [apiTokenEditing, setAPITokenEditing] = useState<boolean>(false);

  useEffect(() => setTelegramBot(initialTelegramBot), [initialTelegramBot]);

  const toggleAPITokenState = useCallback(
    () => setAPITokenEditing(!apiTokenEditing),
    [apiTokenEditing],
  );

  useEffect(() => {
    let isCheckActive: boolean = true;

    const checkStatus = async () => {
      if (!isCheckActive || !telegramBot.is_loading) return;

      const response = await TelegramBotAPI.get(telegramBot.id);

      if (!response.ok || response.json.is_loading) {
        if (!response.ok) {
          createMessageToast({
            message: t('messages..getTelegramBot.error'),
            level: 'error',
          });
        }

        setTimeout(checkStatus, 3000);
        return;
      }

      setTelegramBot(response.json);
    };
    checkStatus();

    return () => {
      isCheckActive = false;
    };
  }, [telegramBot.is_loading]);

  return (
    <TelegramBotContext.Provider value={[telegramBot, setTelegramBot]}>
      <Block
        {...props}
        variant='light'
        className={cn('flex', 'flex-col', 'gap-1', className)}
      >
        <h4 className='text-center text-2xl font-semibold'>
          <a
            href={`https://t.me/${telegramBot.username}`}
            rel='noreferrer'
            target='_blank'
          >
            {telegramBot.username}
          </a>
        </h4>
        <Table size='sm' className='align-middle'>
          <Table.Body>
            <Table.Row>
              <Table.Head scope='row'>{t('table.status.header')}:</Table.Head>
              <Slot className='w-full'>
                {telegramBot.is_loading ? (
                  <Table.Cell className='text-secondary'>
                    {t('table.status.loading')}
                  </Table.Cell>
                ) : telegramBot.is_enabled ? (
                  <Table.Cell className='text-success'>
                    {t('table.status.enabled')}
                  </Table.Cell>
                ) : (
                  <Table.Cell className='text-danger'>
                    {t('table.status.disabled')}
                  </Table.Cell>
                )}
              </Slot>
            </Table.Row>
            <Table.Row>
              <Table.Head scope='row' className='text-nowrap'>
                {t('table.apiToken.header')}:
              </Table.Head>
              <Table.Cell>
                {apiTokenEditing ? (
                  <APITokenEditing
                    onSaved={toggleAPITokenState}
                    onCancel={toggleAPITokenState}
                  />
                ) : (
                  <APITokenDisplay onEdit={toggleAPITokenState} />
                )}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Head scope='row'>{t('table.private.header')}:</Table.Head>
              <Table.Cell>
                <PrivateSwitch />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Head scope='row'>{t('table.storage.header')}:</Table.Head>
              <Table.Cell>
                <TelegramBotStorage telegramBot={telegramBot} />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Head scope='row'>{t('table.addedDate.header')}:</Table.Head>
              <Table.Cell>{formatDate(telegramBot.added_date)}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        {children}
      </Block>
    </TelegramBotContext.Provider>
  );
}

export default TelegramBotBlock;
