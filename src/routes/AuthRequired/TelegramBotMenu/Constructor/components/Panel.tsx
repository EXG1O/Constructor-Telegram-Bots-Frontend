import React, { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel as RFPanel, PanelProps as RFPanelProps } from '@xyflow/react';

import { RouteID } from 'routes';

import PlusButton from 'components/shared/PlusButton';
import Button from 'components/ui/Button';
import Collapsible from 'components/ui/Collapsible';

import { useBackgroundTaskOffcanvasStore } from './BackgroundTaskOffcanvas/store';
import { useCommandOffcanvasStore } from './CommandOffcanvas/store';
import { useConditionOffcanvasStore } from './ConditionOffcanvas/store';
import { useTriggerOffcanvasStore } from './TriggerOffcanvas/store';

import cn from 'utils/cn';

const BasePanel = RFPanel;
BasePanel.displayName = 'BasePanel';

export interface PanelProps extends Omit<RFPanelProps, 'position' | 'children'> {}

function Panel({ className, ...props }: PanelProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'panel',
  });

  const [open, setOpen] = useState<boolean>(false);

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

  function handleAddTriggerClick(): void {
    showAddTriggerOffcanvas();
  }

  function handleAddCommandClick(): void {
    showAddCommandOffcanvas();
  }

  function handleAddConditionClick(): void {
    showAddConditionOffcanvas();
  }

  function handleAddBackgroundTaskClick(): void {
    showAddBackgroundTaskOffcanvas();
  }

  return (
    <BasePanel
      {...props}
      position='top-right'
      className={cn('rounded-sm', 'shadow-sm', 'overflow-hidden', className)}
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger asChild>
          <Button
            size='sm'
            variant={open ? 'secondary' : 'dark'}
            className={cn('w-full', open && 'rounded-b-none')}
          >
            {open ? t('hideButton') : t('showButton')}
          </Button>
        </Collapsible.Trigger>
        <Collapsible.Body>
          <div
            className={cn(
              'flex',
              'flex-col',
              'w-full',
              'bg-white',
              'p-1',
              'gap-1',
              className,
            )}
          >
            <PlusButton size='sm' variant='dark' onClick={handleAddTriggerClick}>
              {t('addTriggerButton')}
            </PlusButton>
            <PlusButton size='sm' variant='dark' onClick={handleAddCommandClick}>
              {t('addCommandButton')}
            </PlusButton>
            <PlusButton size='sm' variant='dark' onClick={handleAddConditionClick}>
              {t('addConditionButton')}
            </PlusButton>
            <PlusButton size='sm' variant='dark' onClick={handleAddBackgroundTaskClick}>
              {t('addBackgroundTaskButton')}
            </PlusButton>
          </div>
        </Collapsible.Body>
      </Collapsible>
    </BasePanel>
  );
}

export default Panel;
