import React, { HTMLAttributes, memo, ReactElement } from 'react';
import classNames from 'classnames';

import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';
import useRootRouteLoaderData from 'routes/Root/hooks/useRootRouteLoaderData';

import LoginButton from 'components/shared/LoginButton';

import LanguagesDropdown from './LanguagesDropdown';
import TelegramBotMenuDropdown from './TelegramBotMenuDropdown';
import UserMenuDropdown from './UserMenuDropdown';

import { TelegramBot } from 'api/telegram_bots/types';

export type ButtonsProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

function Buttons({ className, ...props }: ButtonsProps): ReactElement<ButtonsProps> {
  const { user } = useRootRouteLoaderData();
  const telegramBotMenuRootLoaderData = useTelegramBotMenuRootRouteLoaderData() as
    | ReturnType<typeof useTelegramBotMenuRootRouteLoaderData>
    | undefined;
  const telegramBot: TelegramBot | undefined =
    telegramBotMenuRootLoaderData?.telegramBot;

  return (
    <div
      {...props}
      className={classNames(
        'd-flex flex-nowrap justify-content-lg-end gap-2',
        className,
      )}
    >
      <LanguagesDropdown />
      {user ? (
        <>
          <UserMenuDropdown user={user} />
          {telegramBot && <TelegramBotMenuDropdown telegramBot={telegramBot} />}
        </>
      ) : (
        <LoginButton variant='dark' />
      )}
    </div>
  );
}

export default memo(Buttons);
