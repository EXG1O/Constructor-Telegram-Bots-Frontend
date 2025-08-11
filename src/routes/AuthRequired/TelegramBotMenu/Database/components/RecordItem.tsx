import React, { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Trash2, X } from 'lucide-react';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { useConfirmModalStore } from 'components/shared/ConfirmModal/store';
import CodeInput, { Editor } from 'components/ui/CodeInput';
import IconButton from 'components/ui/IconButton';
import List from 'components/ui/List';
import { ListItemProps } from 'components/ui/List/components/ListItem';
import Spinner from 'components/ui/Spinner';
import { createMessageToast } from 'components/ui/ToastContainer';

import useDatabaseRecordsStore from '../hooks/useDatabaseRecordsStore';

import { DatabaseRecordAPI } from 'api/telegram-bots/database-record';
import { DatabaseRecord } from 'api/telegram-bots/database-record/types';

import cn from 'utils/cn';

export interface RecordItemProps extends Omit<ListItemProps, 'children'> {
  record: DatabaseRecord;
}

function RecordItem({ record, className, ...props }: RecordItemProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuDatabase, {
    keyPrefix: 'records',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const updateRecords = useDatabaseRecordsStore((state) => state.updateRecords);

  const defaultValue = useMemo<string>(
    () => JSON.stringify(record.data, undefined, 2),
    [record.data],
  );

  const [value, setValue] = useState<string>(defaultValue);
  const [loading, setLoading] = useState<boolean>(false);

  const editorRef = useRef<Editor | null>(null);
  const oldValue = useRef<string>(value);

  const showConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore((state) => state.setLoading);

  useEffect(() => {
    if (!editorRef.current) return;

    if (oldValue.current === defaultValue || value === defaultValue) {
      editorRef.current?.updateLayout(true);
    }
  }, [value]);

  function handleMount(editor: Editor): void {
    editorRef.current = editor;
  }

  function handleChange(_editor: Editor, nextValue: string): void {
    oldValue.current = value;
    setValue(nextValue);
  }

  async function handleConfirmClick(): Promise<void> {
    setLoading(true);

    try {
      const data: Record<string, any> = JSON.parse(value);

      const response = await DatabaseRecordAPI.partialUpdate(
        telegramBot.id,
        record.id,
        { data },
      );

      if (response.ok) {
        updateRecords();
        createMessageToast({
          message: t('messages.partialUpdateRecord.success'),
          level: 'success',
        });
      } else {
        createMessageToast({
          message: t('messages.partialUpdateRecord.error'),
          level: 'error',
        });
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        createMessageToast({
          message: t('messages.partialUpdateRecord.error', {
            context: 'validJSON',
          }),
          level: 'error',
        });
      } else {
        createMessageToast({
          message: t('messages.partialUpdateRecord.error', {
            context: 'other',
          }),
          level: 'error',
        });
      }
    }

    setLoading(false);
  }

  function handleCancelClick(): void {
    oldValue.current = value;
    setValue(defaultValue);
  }

  function handleDeleteClick(): void {
    showConfirmModal({
      title: t('list.item.deleteModal.title'),
      text: t('list.item.deleteModal.text'),
      onConfirm: async () => {
        setLoadingConfirmModal(true);

        const response = await DatabaseRecordAPI.delete(telegramBot.id, record.id);

        if (response.ok) {
          updateRecords();
          hideConfirmModal();
          createMessageToast({
            message: t('list.item.messages.deleteRecord.success'),
            level: 'success',
          });
        } else {
          createMessageToast({
            message: t('list.item.messages.deleteRecord.error'),
            level: 'error',
          });
        }

        setLoadingConfirmModal(false);
      },
      onCancel: null,
    });
  }

  return !loading ? (
    <List.Item {...props} className={cn('flex', 'items-center', 'gap-2', className)}>
      <CodeInput
        size='sm'
        value={value}
        language='json'
        onMount={handleMount}
        onChange={handleChange}
      />
      <div className='inline-flex gap-2'>
        {value !== defaultValue && (
          <div className='inline-flex gap-1'>
            <IconButton size='sm' className='text-success' onClick={handleConfirmClick}>
              <Check />
            </IconButton>
            <IconButton size='sm' className='text-danger' onClick={handleCancelClick}>
              <X />
            </IconButton>
          </div>
        )}
        <IconButton size='sm' className='text-danger' onClick={handleDeleteClick}>
          <Trash2 />
        </IconButton>
      </div>
    </List.Item>
  ) : (
    <List.Item className='flex justify-center'>
      <Spinner size='sm' />
    </List.Item>
  );
}

export default RecordItem;
