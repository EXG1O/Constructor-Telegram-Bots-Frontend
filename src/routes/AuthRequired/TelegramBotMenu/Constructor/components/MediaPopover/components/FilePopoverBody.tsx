import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Popover from 'components/ui/Popover';
import type { PopoverBodyProps } from 'components/ui/Popover/components/PopoverBody';
import Table from 'components/ui/Table';

import formatMB from 'utils/formatMB';

import { useMediaPopoverStore } from '../store';

export interface FilePopoverBodyProps extends Omit<
  PopoverBodyProps,
  'size' | 'children'
> {}

function FilePopoverBody(props: FilePopoverBodyProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'mediaPopover.filePopoverBody',
  });

  const file = useMediaPopoverStore((state) => state.file!);

  return (
    <Popover.Body {...props} size='sm'>
      <Table size='xs' className='text-sm'>
        <Table.Body>
          <Table.Row>
            <Table.Head scope='row'>{t('table.name')}</Table.Head>
            <Table.Cell className='w-min wrap-anywhere'>{file.name}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Head scope='row'>{t('table.size')}</Table.Head>
            <Table.Cell>{formatMB(file.size)}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Popover.Body>
  );
}

export default FilePopoverBody;
