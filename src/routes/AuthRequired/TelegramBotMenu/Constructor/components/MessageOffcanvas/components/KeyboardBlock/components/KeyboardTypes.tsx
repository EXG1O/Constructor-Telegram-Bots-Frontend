import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormTabs, { FormTabsProps } from 'components/shared/FormTabs';
import Tabs from 'components/ui/Tabs';

export type Type = 'default' | 'inline' | 'payment';

export interface KeyboardTypeButtonGroupProps
  extends Omit<FormTabsProps, 'name' | 'size' | 'children'> {}

// const types: Type[] = ['default', 'inline', 'payment'];
const types: Type[] = ['default', 'inline'];

export const defaultType: Type = 'default';

function KeyboardTypes({
  onChange,
  ...props
}: KeyboardTypeButtonGroupProps): ReactElement {
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

export default KeyboardTypes;
