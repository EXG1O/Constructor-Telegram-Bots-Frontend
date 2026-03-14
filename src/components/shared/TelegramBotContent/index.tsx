import React, { forwardRef } from 'react';

import Content, { type ContentProps } from './components/Content';

import { type StoreProps, TelegramBotContentStoreProvider } from './store';

export interface TelegramBotContentProps
  extends StoreProps, Omit<ContentProps, 'onChange'> {}

const TelegramBotContent = forwardRef<HTMLDivElement, TelegramBotContentProps>(
  ({ telegramBot, onChange, ...props }, ref) => {
    return (
      <div {...props} ref={ref}>
        <TelegramBotContentStoreProvider storeProps={{ telegramBot, onChange }}>
          <Content {...props} />
        </TelegramBotContentStoreProvider>
      </div>
    );
  },
);
TelegramBotContent.displayName = 'TelegramBotContent';

export default TelegramBotContent;
