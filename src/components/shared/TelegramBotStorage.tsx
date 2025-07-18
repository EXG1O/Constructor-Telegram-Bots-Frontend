import React, { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, VariantProps } from 'class-variance-authority';

import ProgressBar, { ProgressBarProps } from 'components/ui/ProgressBar';

import { TelegramBot } from 'api/telegram_bots/telegram_bot/types';

import cn from 'utils/cn';

export const telegramBotStorageVariants = cva(
  ['flex', 'w-full', 'items-center', 'gap-2', 'text-nowrap'],
  {
    variants: {
      size: {
        sm: ['text-sm'],
        md: ['text-base'],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface TelegramBotStorageProps
  extends Omit<ProgressBarProps, 'now' | 'min' | 'max'>,
    VariantProps<typeof telegramBotStorageVariants> {
  telegramBot: TelegramBot;
  usedStorageSize?: number;
}

const TelegramBotStorage = forwardRef<HTMLDivElement, TelegramBotStorageProps>(
  (
    {
      asChild,
      size,
      telegramBot,
      usedStorageSize = telegramBot.used_storage_size,
      className,
      ...props
    },
    ref,
  ) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        {...props}
        ref={ref}
        className={cn(telegramBotStorageVariants({ size, className }))}
      >
        <span>{`${(usedStorageSize / 1024 ** 2).toFixed(2)} MB`}</span>
        <ProgressBar
          now={usedStorageSize}
          max={telegramBot.storage_size}
          className='flex-auto'
        />
        <span>{`${(telegramBot.storage_size / 1024 ** 2).toFixed(2)} MB`}</span>
      </Component>
    );
  },
);
TelegramBotStorage.displayName = 'TelegramBotStorage';

export default TelegramBotStorage;
