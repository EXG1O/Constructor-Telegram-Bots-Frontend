import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import telegramBotSystemVariables, {
  TelegramBotSystemVariablesType,
} from 'constants/telegramBotSystemVariables';

import Tabs, { TabsProps } from 'components/ui/Tabs';

export interface TelegramBotSystemVariablesTypeTabsProps
  extends Omit<TabsProps, 'value' | 'children' | 'onChange'> {
  type: TelegramBotSystemVariablesType;
  onChange?: (type: TelegramBotSystemVariablesType) => void;
}

const TelegramBotSystemVariablesTypeTabs = forwardRef<
  HTMLDivElement,
  TelegramBotSystemVariablesTypeTabsProps
>(({ type, onChange, ...props }, ref) => {
  const { t } = useTranslation('components', {
    keyPrefix: 'telegramBotSystemVariablesTypeTabs',
  });

  function handleChange(value: string): void {
    onChange?.(value as TelegramBotSystemVariablesType);
  }

  return (
    <Tabs {...props} ref={ref} value={type} onChange={handleChange}>
      {Object.keys(telegramBotSystemVariables).map((key) => (
        <Tabs.Button key={key} value={key}>
          {t(key)}
        </Tabs.Button>
      ))}
    </Tabs>
  );
});
TelegramBotSystemVariablesTypeTabs.displayName = 'TelegramBotSystemVariablesTypeTabs';

export default TelegramBotSystemVariablesTypeTabs;
