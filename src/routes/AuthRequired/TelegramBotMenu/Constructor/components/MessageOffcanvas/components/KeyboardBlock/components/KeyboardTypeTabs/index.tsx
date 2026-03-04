import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormTabs, { type FormTabsProps } from 'components/shared/FormTabs';
import Tabs from 'components/ui/Tabs';

import type { Type } from './types';

export interface KeyboardTypeTabsButtonGroupProps extends Omit<
  FormTabsProps,
  'name' | 'size' | 'children'
> {}

// const types: Type[] = ['default', 'inline', 'payment'];
const types: Type[] = ['default', 'inline'];

function KeyboardTypeTabs({
  onChange,
  ...props
}: KeyboardTypeTabsButtonGroupProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'messageOffcanvas.keyboardBlock.types',
  });

  return (
    <FormTabs {...props} name='keyboard.type' size='sm'>
      {types.map((type, index) => (
        <Tabs.Button key={index} value={type}>
          {t(type)}
        </Tabs.Button>
      ))}
    </FormTabs>
  );
}

export default KeyboardTypeTabs;
