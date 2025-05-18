import React, { HTMLAttributes, memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel as BasePanel } from 'reactflow';

import { RouteID } from 'routes';

import PlusButton from 'components/shared/PlusButton';
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
        <PlusButton size='sm' variant='dark' onClick={() => showAddCommandOffcanvas()}>
          {t('addCommandButton')}
        </PlusButton>
        <PlusButton size='sm' variant='dark' onClick={() => showAddConditionOffcanvas()}>
          {t('addConditionButton')}
        </PlusButton>
        <PlusButton
          size='sm'
          variant='dark'
          onClick={() => showAddBackgroundTaskOffcanvas()}
        >
          {t('addBackgroundTaskButton')}
        </PlusButton>
      </Stack>
    </BasePanel>
  );
}

export default memo(Panel);
