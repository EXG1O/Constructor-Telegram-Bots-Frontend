import React, { forwardRef, HTMLAttributes } from 'react';

import Inner from './components/Inner';
import StoreProvider, { StoreProviderProps } from './providers/StoreProvider';

export interface TelegramBotContentProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'>,
    Omit<StoreProviderProps, 'children'> {}

const TelegramBotContent = forwardRef<HTMLDivElement, TelegramBotContentProps>(
  ({ telegramBot, onChange, ...props }, ref) => {
    return (
      <div {...props} ref={ref}>
        <StoreProvider telegramBot={telegramBot} onChange={onChange}>
          <Inner />
        </StoreProvider>
      </div>
    );
  },
);
TelegramBotContent.displayName = 'TelegramBotContent';

export default TelegramBotContent;
