import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import type { RouteID } from 'routes';

import Modal, { type ModalProps } from 'components/ui/Modal';

import BlockButton from './components/BlockButton';

import { useAPIRequestOffcanvasStore } from '../APIRequestOffcanvas/store';
import { useBackgroundTaskOffcanvasStore } from '../BackgroundTaskOffcanvas/store';
import { useConditionOffcanvasStore } from '../ConditionOffcanvas/store';
import { useDatabaseOperationOffcanvasStore } from '../DatabaseOperationOffcanvas/store';
import { useInvoiceOffcanvasStore } from '../InvoiceOffcanvas/store';
import { useMessageOffcanvasStore } from '../MessageOffcanvas/store';
import { useRandomizerOffcanvasStore } from '../RandomizerOffcanvas/store';
import { useTemporaryVariableOffcanvasStore } from '../TemporaryVariableOffcanvas/store';
import { useTimerOffcanvasStore } from '../TimerOffcanvas/store';
import { useTriggerOffcanvasStore } from '../TriggerOffcanvas/store';

export interface SelectBlockModalProps extends ModalProps {}

function SelectBlockModal({ children, ...props }: SelectBlockModalProps): ReactElement {
  const { t } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'selectBlockModal' },
  );

  const showAddTriggerOffcanvas = useTriggerOffcanvasStore(
    (state) => state.showOffcanvas,
  );
  const showAddMessageOffcanvas = useMessageOffcanvasStore(
    (state) => state.showOffcanvas,
  );
  const showAddConditionOffcanvas = useConditionOffcanvasStore(
    (state) => state.showOffcanvas,
  );
  const showAddBackgroundTaskOffcanvas = useBackgroundTaskOffcanvasStore(
    (state) => state.showOffcanvas,
  );
  const showAddAPIRequestOffcanvas = useAPIRequestOffcanvasStore(
    (state) => state.showOffcanvas,
  );
  const showAddDatabaseOperationOffcanvas = useDatabaseOperationOffcanvasStore(
    (state) => state.showOffcanvas,
  );
  const showAddInvoiceOffcanvas = useInvoiceOffcanvasStore(
    (state) => state.showOffcanvas,
  );
  const showAddTemporaryVariableOffcanvas = useTemporaryVariableOffcanvasStore(
    (state) => state.showOffcanvas,
  );
  const showAddRandomizerOffcanvas = useRandomizerOffcanvasStore(
    (state) => state.showOffcanvas,
  );
  const showAddTimerOffcanvas = useTimerOffcanvasStore((state) => state.showOffcanvas);

  return (
    <Modal {...props}>
      {children}
      <Modal.Content>
        <Modal.Header closeButton>
          <Modal.Title>{t('title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='grid grid-cols-2 gap-2'>
          <BlockButton
            name={t('trigger.name')}
            description={t('trigger.description')}
            onClick={() => showAddTriggerOffcanvas()}
          />
          <BlockButton
            name={t('condition.name')}
            description={t('condition.description')}
            onClick={() => showAddConditionOffcanvas()}
          />
          <BlockButton
            name={t('message.name')}
            description={t('message.description')}
            onClick={() => showAddMessageOffcanvas()}
          />
          <BlockButton
            name={t('invoice.name')}
            description={t('invoice.description')}
            onClick={() => showAddInvoiceOffcanvas()}
          />
          <BlockButton
            name={t('apiRequest.name')}
            description={t('apiRequest.description')}
            onClick={() => showAddAPIRequestOffcanvas()}
          />
          <BlockButton
            name={t('backgroundTask.name')}
            description={t('backgroundTask.description')}
            onClick={() => showAddBackgroundTaskOffcanvas()}
          />
          <BlockButton
            name={t('databaseOperation.name')}
            description={t('databaseOperation.description')}
            onClick={() => showAddDatabaseOperationOffcanvas()}
          />
          <BlockButton
            name={t('temporaryVariable.name')}
            description={t('temporaryVariable.description')}
            onClick={() => showAddTemporaryVariableOffcanvas()}
          />
          <BlockButton
            name={t('timer.name')}
            description={t('timer.description')}
            onClick={() => showAddTimerOffcanvas()}
          />
          <BlockButton
            name={t('randomizer.name')}
            description={t('randomizer.description')}
            onClick={() => showAddRandomizerOffcanvas()}
          />
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}

export default Object.assign(SelectBlockModal, { Trigger: Modal.Trigger });
