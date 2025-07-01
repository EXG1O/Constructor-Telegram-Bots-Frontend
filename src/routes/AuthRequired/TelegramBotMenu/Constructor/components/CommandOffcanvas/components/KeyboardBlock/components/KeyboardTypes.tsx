import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import { RouteID } from 'routes';

import Tabs, { TabsProps } from 'components/ui/Tabs';

export type Type = 'default' | 'inline' | 'payment';

export interface KeyboardTypeButtonGroupProps
  extends Omit<TabsProps, 'size' | 'value' | 'children'> {}

// const types: Type[] = ['default', 'inline', 'payment'];
const types: Type[] = ['default', 'inline'];

export const defaultType: Type = 'default';

function KeyboardTypes({
  onChange,
  ...props
}: KeyboardTypeButtonGroupProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'commandOffcanvas.keyboardBlock.types',
  });

  const [{ value }, _meta, { setValue }] = useField<Type>('keyboard.type');

  function handleChange(value: string): void {
    setValue(value as Type);
    onChange?.(value);
  }

  return (
    <Tabs {...props} size='sm' value={value} onChange={handleChange}>
      {types.map((type, index) => (
        <Tabs.Button key={index} value={type}>
          {t(type)}
        </Tabs.Button>
      ))}
    </Tabs>
  );
}

export default KeyboardTypes;
