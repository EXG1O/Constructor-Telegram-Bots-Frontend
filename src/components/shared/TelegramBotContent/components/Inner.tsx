import React, { HTMLAttributes, ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Slot } from '@radix-ui/react-slot';
import formatDate from 'i18n/formatDate';

import TelegramBotStorage from 'components/shared/TelegramBotStorage';
import Table from 'components/ui/Table';
import { createMessageToast } from 'components/ui/ToastContainer';

import APIToken from './APIToken';
import PrivateSwitch from './PrivateSwitch';

import useTelegramBotContentStore from '../hooks/useTelegramBotContentStore';

import { TelegramBotAPI } from 'api/telegram-bots/telegram-bot';

import cn from 'utils/cn';

export interface InnerProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {}

function Inner({ className, ...props }: InnerProps): ReactElement {
  const { t } = useTranslation('components', { keyPrefix: 'telegramBotContent' });

  const telegramBot = useTelegramBotContentStore((state) => state.telegramBot);
  const setTelegramBot = useTelegramBotContentStore((state) => state.setTelegramBot);

  useEffect(() => {
    let timeoutID: NodeJS.Timeout | null = null;

    const checkStatus = async () => {
      if (!telegramBot.is_loading) return;

      const response = await TelegramBotAPI.get(telegramBot.id);

      if (!response.ok || response.json.is_loading) {
        if (!response.ok) {
          createMessageToast({
            message: t('messages..getTelegramBot.error'),
            level: 'error',
          });
        }

        timeoutID = setTimeout(checkStatus, 3000);
        return;
      }

      setTelegramBot(response.json);
    };
    checkStatus();

    return () => {
      if (timeoutID) {
        clearTimeout(timeoutID);
      }
    };
  }, [telegramBot.is_loading]);

  return (
    <Table {...props} size='sm' className={cn('align-middle', className)}>
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
            <APIToken />
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
  );
}

export default Inner;
