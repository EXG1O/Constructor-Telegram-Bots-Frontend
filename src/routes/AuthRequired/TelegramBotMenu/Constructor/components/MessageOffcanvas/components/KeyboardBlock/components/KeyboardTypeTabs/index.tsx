import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import type { RouteID } from 'routes';

import FormTabs, { type FormTabsProps } from 'components/shared/FormTabs';
import IconButton from 'components/ui/IconButton';
import Popover from 'components/ui/Popover';
import Tabs from 'components/ui/Tabs';

import { Type } from './enums';

export interface KeyboardTypeTabsButtonGroupProps extends Omit<
  FormTabsProps,
  'name' | 'size' | 'children'
> {}

function KeyboardTypeTabs(props: KeyboardTypeTabsButtonGroupProps): ReactElement {
  const { t } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'messageOffcanvas.keyboardBlock.types' },
  );

  return (
    <FormTabs {...props} name='keyboard.type' size='sm'>
      <Tabs.Button value={Type.Default}>{t('default')}</Tabs.Button>
      <Tabs.Button value={Type.Inline}>{t('inline')}</Tabs.Button>
      <Tabs.Button value={Type.Removal} className='gap-0.75'>
        <span>{t('removal.name')}</span>
        <Popover>
          <Popover.Trigger asChild onClick={(event) => event.stopPropagation()}>
            <IconButton size='xs' className='mt-0.5 text-foreground'>
              <Popover.Trigger.QuestionIcon />
            </IconButton>
          </Popover.Trigger>
          <Popover.Body size='sm' content='text'>
            {t('removal.helpText')}
          </Popover.Body>
        </Popover>
      </Tabs.Button>
    </FormTabs>
  );
}

export default KeyboardTypeTabs;
