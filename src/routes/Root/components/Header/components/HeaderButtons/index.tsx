import React, { HTMLAttributes, ReactElement } from 'react';

import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';
import useLoginLoaderData from 'routes/Login/hooks/useLoginRouteLoaderData';
import useRootRouteLoaderData from 'routes/Root/hooks/useRootRouteLoaderData';

import LoginButton from 'components/shared/LoginButton';
import Button from 'components/ui/Button';
import Spinner from 'components/ui/Spinner';

import LanguagesDropdown from './components/LanguagesDropdown';
import TelegramBotDropdown from './components/TelegramBotDropdown';
import UserDropdown from './components/UserDropdown';

import { TelegramBot } from 'api/telegram-bots/telegram-bot/types';

import cn from 'utils/cn';

export interface HeaderButtonsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

function HeaderButtons({ className, ...props }: HeaderButtonsProps): ReactElement {
  const login = useLoginLoaderData() as
    | ReturnType<typeof useLoginLoaderData>
    | undefined;
  const { user } = useRootRouteLoaderData();
  const telegramBot: TelegramBot | undefined = (
    useTelegramBotMenuRootRouteLoaderData() as
      | ReturnType<typeof useTelegramBotMenuRootRouteLoaderData>
      | undefined
  )?.telegramBot;

  return (
    <div
      {...props}
      className={cn(
        'flex',
        'flex-auto',
        'flex-nowrap',
        'items-center',
        'gap-2',
        'lg:justify-end',
        'xl:col-span-1',
        className,
      )}
    >
      <LanguagesDropdown />
      {user ? (
        <>
          <UserDropdown user={user} />
          {telegramBot && <TelegramBotDropdown telegramBot={telegramBot} />}
        </>
      ) : login === undefined ? (
        <LoginButton />
      ) : (
        <Button variant='dark' disabled>
          <Spinner size='xs' />
        </Button>
      )}
    </div>
  );
}

export default HeaderButtons;
