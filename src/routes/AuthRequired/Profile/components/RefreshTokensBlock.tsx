import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import formatDate from 'i18n/formatDate';

import { RouteID } from 'routes';

import Block, { type BlockProps } from 'components/ui/Block';
import IconButton from 'components/ui/IconButton';
import Popover from 'components/ui/Popover';
import Table from 'components/ui/Table';

import useProfileRouteLoaderData from '../hooks/useProfileRouteLoaderData';

import cn from 'utils/cn';

export interface RefreshTokensBlockProps extends Omit<
  BlockProps,
  'size' | 'variant' | 'children'
> {}

function RefreshTokensBlock({
  className,
  ...props
}: RefreshTokensBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.Profile, { keyPrefix: 'refreshTokensBlock' });

  const { refreshTokens } = useProfileRouteLoaderData();

  return (
    <Block
      {...props}
      variant='light'
      className={cn('flex', 'flex-col', 'gap-2', className)}
    >
      <div className='flex items-center justify-center gap-1'>
        <h3 className='text-3xl font-semibold'>{t('title')}</h3>
        <Popover>
          <Popover.Trigger asChild>
            <IconButton size='sm' className='mt-1'>
              <Popover.Trigger.QuestionIcon />
            </IconButton>
          </Popover.Trigger>
          <Popover.Body size='sm' content='text'>
            {t('helpText')}
          </Popover.Body>
        </Popover>
      </div>
      <div className='w-full overflow-hidden rounded-md'>
        <Table striped>
          <Table.Header>
            <Table.Head>ID</Table.Head>
            <Table.Head>{t('table.headers.blacklistedDate')}</Table.Head>
            <Table.Head>{t('table.headers.expiryDate')}</Table.Head>
            <Table.Head>{t('table.headers.createdDate')}</Table.Head>
          </Table.Header>
          <Table.Body className='text-center text-nowrap'>
            {refreshTokens.map((token) => (
              <Table.Row key={token.jti}>
                <Table.Cell>{token.jti}</Table.Cell>
                <Table.Cell>
                  {token.blacklisted_date ? formatDate(token.blacklisted_date) : '-'}
                </Table.Cell>
                <Table.Cell>{formatDate(token.expiry_date)}</Table.Cell>
                <Table.Cell>{formatDate(token.created_date)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </Block>
  );
}

export default RefreshTokensBlock;
