import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Modal, { ModalProps } from 'components/ui/Modal';

import BlockButton from './components/BlockButton';

import { useAPIRequestOffcanvasStore } from '../APIRequestOffcanvas/store';
import { useBackgroundTaskOffcanvasStore } from '../BackgroundTaskOffcanvas/store';
import { useCommandOffcanvasStore } from '../CommandOffcanvas/store';
import { useConditionOffcanvasStore } from '../ConditionOffcanvas/store';
import { useDatabaseOperationOffcanvasStore } from '../DatabaseOperationOffcanvas/store';
import { useTriggerOffcanvasStore } from '../TriggerOffcanvas/store';

export interface SelectBlockModalProps extends ModalProps {}

function SelectBlockModal({ children, ...props }: SelectBlockModalProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'selectBlockModal',
  });

  const showAddTriggerOffcanvas = useTriggerOffcanvasStore(
    (state) => state.showOffcanvas,
  );
  const showAddCommandOffcanvas = useCommandOffcanvasStore(
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

  return (
    <Modal {...props}>
      {children}
      <Modal.Content>
        <Modal.Header closeButton>
          <Modal.Title>{t('title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='grid grid-cols-2 gap-2'>
          <BlockButton blockName='trigger' onClick={() => showAddTriggerOffcanvas()} />
          <BlockButton blockName='command' onClick={() => showAddCommandOffcanvas()} />
          <BlockButton
            blockName='condition'
            onClick={() => showAddConditionOffcanvas()}
          />
          <BlockButton
            blockName='backgroundTask'
            onClick={() => showAddBackgroundTaskOffcanvas()}
          />
          <BlockButton
            blockName='apiRequest'
            onClick={() => showAddAPIRequestOffcanvas()}
          />
          <BlockButton
            blockName='databaseOperation'
            onClick={() => showAddDatabaseOperationOffcanvas()}
          />
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}

export default Object.assign(SelectBlockModal, { Trigger: Modal.Trigger });
