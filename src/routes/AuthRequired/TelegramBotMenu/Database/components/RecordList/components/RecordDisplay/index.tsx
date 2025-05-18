import React, {
  CSSProperties,
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import ListGroupItem, { ListGroupItemProps } from 'react-bootstrap/ListGroupItem';

import { useAskConfirmModalStore } from 'components/AskConfirmModal/store';
import Button from 'components/ui/Button';
import Spinner from 'components/ui/Spinner';
import MonacoEditor, { MonacoEditorProps } from 'components/MonacoEditor';
import { createMessageToast } from 'components/ToastContainer';

import ConfirmButtonGroup, {
  ConfirmButtonGroupProps,
} from './components/ConfirmButtonGroup';

import Wrapper from '../Wrapper';

import useDatabaseRecordsStore from '../../../../hooks/useDatabaseRecordsStore';

import TrashIcon from 'assets/icons/trash.svg';

import { DatabaseRecordAPI } from 'api/telegram_bots/main';
import { DatabaseRecord } from 'api/telegram_bots/types';

export interface RecordDisplayProps extends Omit<ListGroupItemProps, 'children'> {
  record: DatabaseRecord;
}

const options: NonNullable<MonacoEditorProps['options']> = {
  glyphMargin: false,
  folding: false,
  lineNumbers: 'off',
  lineDecorationsWidth: 0,
  lineNumbersMinChars: 0,
};

const deleteButtonStyle: CSSProperties = { width: '25px', height: '25px' };

type ChangeHandler = NonNullable<MonacoEditorProps['onChange']>;
type ConfirmHandler = NonNullable<ConfirmButtonGroupProps['onConfirm']>;
type CancelHandler = NonNullable<ConfirmButtonGroupProps['onCancel']>;

function RecordDisplay({
  record,
  className,
  ...props
}: RecordDisplayProps): ReactElement<RecordDisplayProps> {
  const { t } = useTranslation(RouteID.TelegramBotMenuDatabase, {
    keyPrefix: 'records',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const updateRecords = useDatabaseRecordsStore((state) => state.updateRecords);

  const initialValue = useMemo<string>(
    () => JSON.stringify(record.data, undefined, 4),
    [],
  );

  const [value, setValue] = useState<string>(initialValue);
  const [loading, setLoading] = useState<boolean>(false);

  const setShowAskConfirmModal = useAskConfirmModalStore((state) => state.setShow);
  const hideAskConfirmModal = useAskConfirmModalStore((state) => state.setHide);
  const setLoadingAskConfirmModal = useAskConfirmModalStore(
    (state) => state.setLoading,
  );

  function showDeleteModal(): void {
    setShowAskConfirmModal({
      title: t('list.display.deleteModal.title'),
      text: t('list.display.deleteModal.text'),
      onConfirm: async () => {
        setLoadingAskConfirmModal(true);

        const response = await DatabaseRecordAPI.delete(telegramBot.id, record.id);

        if (response.ok) {
          updateRecords();
          hideAskConfirmModal();
          createMessageToast({
            message: t('list.display.messages.deleteRecord.success'),
            level: 'success',
          });
        } else {
          createMessageToast({
            message: t('list.display.messages.deleteRecord.error'),
            level: 'error',
          });
        }

        setLoadingAskConfirmModal(false);
      },
      onCancel: null,
    });
  }

  const handleChange = useCallback<ChangeHandler>(
    (editor, newValue) => {
      if (initialValue === value && value !== newValue) {
        editor.updateLayout(true);
      }

      setValue(newValue);
    },
    [value],
  );

  const handleConfirm = useCallback<ConfirmHandler>(async () => {
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
  }, [telegramBot.id, record.id, value]);

  const handleCancel = useCallback<CancelHandler>(
    () => setValue(initialValue),
    [initialValue],
  );

  return !loading ? (
    <ListGroupItem {...props} className={classNames(className, 'd-flex gap-3')}>
      <MonacoEditor
        size='sm'
        value={value}
        language='json'
        options={options}
        onChange={handleChange}
      />
      <div className='d-flex align-items-center gap-2'>
        {value !== initialValue && (
          <ConfirmButtonGroup onConfirm={handleConfirm} onCancel={handleCancel} />
        )}
        <Button
          size='sm'
          variant='danger'
          className='d-flex justify-content-center align-items-center p-0'
          style={deleteButtonStyle}
          onClick={showDeleteModal}
        >
          <TrashIcon width={18} height={18} />
        </Button>
      </div>
    </ListGroupItem>
  ) : (
    <Wrapper className='d-flex justify-content-center p-3'>
      <Spinner size='sm' />
    </Wrapper>
  );
}

export default RecordDisplay;
