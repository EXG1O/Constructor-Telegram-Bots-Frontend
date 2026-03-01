import React, { HTMLAttributes, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Clipboard, SquarePen, Trash2 } from 'lucide-react';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { useConfirmModalStore } from 'components/shared/ConfirmModal/store';
import IconButton from 'components/ui/IconButton';
import Table from 'components/ui/Table';
import { createMessageToast } from 'components/ui/ToastContainer';

import ClipboardButtonSlot from '../../../../ClipboardButtonSlot';
import { useVariableModalStore } from '../../VariableModal/store';

import useUserVariablesStore from '../../../hooks/useUserVariablesStore';

import { VariableAPI } from 'api/telegram-bots/variable';
import { Variable } from 'api/telegram-bots/variable/types';

import cn from 'utils/cn';

export interface TableRowProps
  extends Omit<HTMLAttributes<HTMLTableRowElement>, 'children'> {
  variable: Variable;
}

function TableRow({ variable, className, ...props }: TableRowProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuVariables, {
    keyPrefix: 'user.table.row',
  });

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const updateVariables = useUserVariablesStore((state) => state.updateVariables);

  const showConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore((state) => state.setLoading);

  const showVariableModal = useVariableModalStore((state) => state.showModal);

  function handleEditClick(): void {
    showVariableModal(variable.id);
  }

  function handleDeleteClick(): void {
    showConfirmModal({
      title: t('deleteModal.title'),
      text: t('deleteModal.text'),
      onConfirm: async () => {
        setLoadingConfirmModal(true);

        const response = await VariableAPI.delete(telegramBotID, variable.id);

        if (response.ok) {
          updateVariables();
          hideConfirmModal();
          createMessageToast({
            message: t('messages.deleteVariable.success'),
            level: 'success',
          });
        } else {
          createMessageToast({
            message: t('messages.deleteVariable.error'),
            level: 'error',
          });
        }

        setLoadingConfirmModal(false);
      },
      onCancel: null,
    });
  }

  return (
    <Table.Row {...props} className={cn('text-nowrap', className)}>
      <Table.Cell className='w-1/2'>
        <div className='flex items-center gap-1'>
          <ClipboardButtonSlot variable={['USER', variable.name].join('.')}>
            <IconButton size='sm'>
              <Clipboard />
            </IconButton>
          </ClipboardButtonSlot>
          <span className='text-info-emphasis'>{variable.name}</span>
        </div>
      </Table.Cell>
      <Table.Cell>{variable.description}</Table.Cell>
      <Table.Cell className='w-px'>
        <div className='flex items-center gap-1'>
          <IconButton size='sm' onClick={handleEditClick}>
            <SquarePen />
          </IconButton>
          <IconButton size='sm' className='text-danger' onClick={handleDeleteClick}>
            <Trash2 />
          </IconButton>
        </div>
      </Table.Cell>
    </Table.Row>
  );
}

export default TableRow;
