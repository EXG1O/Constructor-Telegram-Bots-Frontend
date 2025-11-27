import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel as RFPanel, PanelProps as RFPanelProps } from '@xyflow/react';

import { RouteID } from 'routes';

import PlusButton from 'components/shared/PlusButton';

import SelectBlockModal from './SelectBlockModal';

const PrimitivePanel = RFPanel;
PrimitivePanel.displayName = 'PrimitivePanel';

export interface PanelProps extends Omit<RFPanelProps, 'position' | 'children'> {}

function Panel({ className, ...props }: PanelProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'panel',
  });

  return (
    <PrimitivePanel {...props} position='top-right'>
      <SelectBlockModal>
        <SelectBlockModal.Trigger>
          <PlusButton size='sm' variant='dark' className='shadow-sm'>
            {t('addBlockButton')}
          </PlusButton>
        </SelectBlockModal.Trigger>
      </SelectBlockModal>
    </PrimitivePanel>
  );
}

export default memo(Panel);
