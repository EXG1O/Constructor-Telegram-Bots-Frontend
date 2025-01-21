import React, { HTMLAttributes, memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel as BasePanel } from 'reactflow';

import { RouteID } from 'routes';

import AddButton from 'components/AddButton';
import Stack from 'components/Stack';

import { useBackgroundTaskOffcanvasStore } from './BackgroundTaskOffcanvas/store';
import { useCommandOffcanvasStore } from './CommandOffcanvas/store';
import { useConditionOffcanvasStore } from './ConditionOffcanvas/store';

export type PanelProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

function Panel({ className, ...props }: PanelProps): ReactElement<PanelProps> {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'panel',
  });

  const showAddCommandOffcanvas = useCommandOffcanvasStore(
    (state) => state.showOffcanvas,
  );
  const showAddConditionOffcanvas = useConditionOffcanvasStore(
    (state) => state.showOffcanvas,
  );
  const showAddBackgroundTaskOffcanvas = useBackgroundTaskOffcanvasStore(
    (state) => state.showOffcanvas,
  );

  return (
    <BasePanel position='top-right'>
      <Stack {...props} gap={1}>
        <AddButton size='sm' variant='dark' onClick={() => showAddCommandOffcanvas()}>
          {t('addCommandButton')}
        </AddButton>
        <AddButton size='sm' variant='dark' onClick={() => showAddConditionOffcanvas()}>
          {t('addConditionButton')}
        </AddButton>
        <AddButton
          size='sm'
          variant='dark'
          onClick={() => showAddBackgroundTaskOffcanvas()}
        >
          {t('addBackgroundTaskButton')}
        </AddButton>
      </Stack>
    </BasePanel>
  );
}

export default memo(Panel);
