import React, { type ReactElement, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Trash2, X } from 'lucide-react';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import CodeInputFeedback from 'components/shared/CodeInputFeedback';
import { useConfirmModalStore } from 'components/shared/ConfirmModal/store';
import type { Editor } from 'components/ui/CodeInput';
import IconButton from 'components/ui/IconButton';
import List from 'components/ui/List';
import type { ListItemProps } from 'components/ui/List/components/ListItem';
import Spinner from 'components/ui/Spinner';
import { createMessageToast } from 'components/ui/ToastContainer';

import useDatabaseRecordsStore from '../hooks/useDatabaseRecordsStore';

import type { DatabaseRecord } from 'api';
import { TelegramBotsService } from 'api';

import cn from 'utils/cn';
import safeParseJSON from 'utils/safeParseJSON';

export interface RecordItemProps extends Omit<ListItemProps, 'children'> {
  record: DatabaseRecord;
}

function RecordItem({ record, className, ...props }: RecordItemProps): ReactElement {
  const { t } = useTranslation<`${RouteID.TelegramBotMenuDatabase}`, any>(
    'telegram-bot-menu-database',
    { keyPrefix: 'records' },
  );

  const botID = useTelegramBotStore((state) => state.telegramBot!.id);

  const updateRecords = useDatabaseRecordsStore((state) => state.updateRecords);

  const defaultValue = useMemo<string>(
    () => JSON.stringify(record.data, null, 2),
    [record.data],
  );

  const [value, setValue] = useState<string>(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const editorRef = useRef<Editor | null>(null);

  const showConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore((state) => state.setLoading);

  function handleMount(editor: Editor): void {
    editorRef.current = editor;
  }

  function handleChange(_editor: Editor, nextValue: string): void {
    if (value === defaultValue || nextValue === defaultValue) {
      editorRef.current?.updateLayout(true);
    }

    setValue(nextValue);

    if (nextValue === defaultValue) {
      setError(null);
    }
  }

  async function handleConfirmClick(): Promise<void> {
    setLoading(true);

    const { error } = await TelegramBotsService.partialUpdateDatabaseRecord({
      path: { telegramBotId: botID, id: record.id },
      body: { data: safeParseJSON(value) },
    });

    if (!error) {
      updateRecords();
      setError(null);
      createMessageToast({
        message: t('messages.partialUpdateRecord.success'),
        level: 'success',
      });
    } else {
      setError(error.errors.find((item) => item.attr === 'data')?.detail ?? null);
      createMessageToast({
        message: t('messages.partialUpdateRecord.error'),
        level: 'error',
      });
    }

    setLoading(false);
  }

  function handleCancelClick(): void {
    editorRef.current?.setValue(defaultValue);
  }

  function handleDeleteClick(): void {
    showConfirmModal({
      title: t('list.item.deleteModal.title'),
      text: t('list.item.deleteModal.text'),
      onConfirm: async () => {
        setLoadingConfirmModal(true);

        const { error } = await TelegramBotsService.deleteDatabaseRecord({
          path: { telegramBotId: botID, id: record.id },
        });

        if (error) {
          createMessageToast({
            message: t('list.item.messages.deleteRecord.error'),
            level: 'error',
          });
          setLoadingConfirmModal(false);
          return;
        }

        updateRecords();
        hideConfirmModal();
        createMessageToast({
          message: t('list.item.messages.deleteRecord.success'),
          level: 'success',
        });
      },
      onCancel: null,
    });
  }

  return !loading ? (
    <List.Item {...props} className={cn('flex', 'items-center', 'gap-2', className)}>
      <CodeInputFeedback
        size='sm'
        value={value}
        language='json'
        error={error}
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
