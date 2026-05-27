import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { FastField, type FastFieldProps } from 'formik';

import { RouteID } from 'routes';

import Block, { type BlockProps } from 'components/ui/Block';
import Clipboard from 'components/ui/Clipboard';
import Table from 'components/ui/Table';

import cn from 'utils/cn';

export interface WebhookBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

function WebhookBlock({ className, ...props }: WebhookBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'triggerOffcanvas.webhookBlock',
  });

  return (
    <Block
      {...props}
      variant='light'
      className={cn('flex', 'flex-col', 'gap-1', className)}
    >
      <Block.Title>
        <h3 className='text-lg font-medium'>{t('title')}</h3>
      </Block.Title>
      <Clipboard>
        <Table size='sm'>
          <FastField name='webhook.url'>
            {({ field }: FastFieldProps) => {
              const url: string = field.value;
              return (
                <Table.Body>
                  <Table.Row>
                    <Table.Head scope='row' className='text-nowrap'>
                      {t('table.url.header')}
                    </Table.Head>
                    {url ? (
                      <>
                        <Table.Cell className='w-px'>
                          <Clipboard.Button value={url} size='sm' />
                        </Table.Cell>
                        <Table.Cell className='wrap-anywhere select-all'>
                          {url}
                        </Table.Cell>
                      </>
                    ) : (
                      <Table.Cell>{t('table.url.placeholder')}</Table.Cell>
                    )}
                  </Table.Row>
                  <Table.Row>
                    <Table.Head scope='row'>{t('table.method.header')}</Table.Head>
                    {url ? <Table.Cell /> : null}
                    <Table.Cell>POST</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Head scope='row'>{t('table.data.header')}</Table.Head>
                    {url ? <Table.Cell /> : null}
                    <Table.Cell>{t('table.data.text')}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              );
            }}
          </FastField>
        </Table>
      </Clipboard>
    </Block>
  );
}

export default WebhookBlock;
