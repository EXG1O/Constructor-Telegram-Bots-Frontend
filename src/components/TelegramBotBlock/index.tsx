import React, {
  memo,
  ReactElement,
  TdHTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import i18n from 'i18n';
import formatDate from 'i18n/formatDate';

import Block, { BlockProps } from 'components/ui/Block';
import Table from 'components/ui/Table';
import TelegramBotStorage from 'components/shared/TelegramBotStorage';
import { createMessageToast } from 'components/ui/ToastContainer';

import APITokenDisplay from './components/APITokenDisplay';
import APITokenEditing from './components/APITokenEditing';
import PrivateSwitch from './components/PrivateSwitch';
import TelegramBotContext from './contexts/TelegramBotContext';

import { TelegramBotAPI } from 'api/telegram_bots/main';
import { TelegramBot } from 'api/telegram_bots/types';

export interface TelegramBotBlockProps
  extends Omit<BlockProps, 'variant' | 'gradient'> {
  telegramBot: TelegramBot;
}

function TelegramBotBlock({
  telegramBot: initialTelegramBot,
  className,
  children,
  ...props
}: TelegramBotBlockProps): ReactElement<TelegramBotBlockProps> {
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

  const loadingStatusProps = useMemo<TdHTMLAttributes<HTMLTableCellElement>>(
    () => ({
      className: 'text-secondary',
      children: t('table.status.loading'),
    }),
    [i18n.language],
  );
  const enabledStatusProps = useMemo<TdHTMLAttributes<HTMLTableCellElement>>(
    () => ({
      className: 'text-success',
      children: t('table.status.enabled'),
    }),
    [i18n.language],
  );
  const disabledStatusProps = useMemo<TdHTMLAttributes<HTMLTableCellElement>>(
    () => ({
      className: 'text-danger',
      children: t('table.status.disabled'),
    }),
    [i18n.language],
  );

  return (
    <TelegramBotContext.Provider value={[telegramBot, setTelegramBot]}>
      <Block
        {...props}
        variant='light'
        className={classNames(className, 'd-flex flex-column gap-2')}
      >
        <h4 className='fw-semibold text-center'>
          <a
            className='text-reset text-decoration-none'
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
              <Table.Cell
                {...(telegramBot.is_loading
                  ? loadingStatusProps
                  : telegramBot.is_enabled
                    ? enabledStatusProps
                    : disabledStatusProps)}
              />
            </Table.Row>
            <Table.Row>
              <Table.Head scope='row' className='text-nowrap'>
                {t('table.apiToken.header')}:
              </Table.Head>
              <Table.Cell className='w-100'>
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

export default memo(TelegramBotBlock);
