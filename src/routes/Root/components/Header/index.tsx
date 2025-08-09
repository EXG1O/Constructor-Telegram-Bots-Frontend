import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';
import useLoginLoaderData from 'routes/Login/hooks/useLoginRouteLoaderData';

import LoginButton from 'components/shared/LoginButton';
import Button from 'components/ui/Button';
import Container from 'components/ui/Container';
import IconButton from 'components/ui/IconButton';
import Spinner from 'components/ui/Spinner';

import HeaderLanguagesDropdown from './components/HeaderLanguagesDropdown';
import HeaderLink from './components/HeaderLink';
import HeaderTelegramBotDropdown from './components/HeaderTelegramBotDropdown';
import HeaderUserDropdown from './components/HeaderUserDropdown';

import useRootRouteLoaderData from '../../hooks/useRootRouteLoaderData';

import Logo from 'assets/logo/logo.svg';

import { TelegramBot } from 'api/telegram-bots/telegram-bot/types';

import cn from 'utils/cn';
import reverse from 'utils/reverse';

function Header(): ReactElement {
  const { t } = useTranslation(RouteID.Root, { keyPrefix: 'header' });

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
    <Container asChild>
      <nav className='flex flex-wrap gap-2 py-2 lg:flex-nowrap xl:grid xl:grid-cols-4'>
        <div className='flex grow-0 items-center xl:col-span-1'>
          <IconButton asChild size={null}>
            <Link to={reverse(RouteID.Home)} className='rounded-full'>
              <Logo className='size-9.5' />
            </Link>
          </IconButton>
        </div>
        <div
          className={cn(
            'xl:col-span-2',
            'flex',
            'flex-nowrap',
            'max-lg:w-[calc(100%-var(--spacing)*11.5)]',
            'xl:justify-center',
            'items-center',
            'overflow-x-auto',
            'scrollbar-thin',
          )}
        >
          <HeaderLink to={reverse(RouteID.Instruction)}>
            {t('links.instruction')}
          </HeaderLink>
          <HeaderLink to={reverse(RouteID.Updates)}>{t('links.updates')}</HeaderLink>
          <HeaderLink to={reverse(RouteID.PrivacyPolicy)}>
            {t('links.privacyPolicy')}
          </HeaderLink>
          <HeaderLink to={reverse(RouteID.Donation)}>{t('links.donation')}</HeaderLink>
        </div>
        <div className='flex flex-auto flex-nowrap items-center gap-2 lg:justify-end xl:col-span-1'>
          <HeaderLanguagesDropdown />
          {user ? (
            <>
              <HeaderUserDropdown user={user} />
              {telegramBot && <HeaderTelegramBotDropdown telegramBot={telegramBot} />}
            </>
          ) : login === undefined ? (
            <LoginButton />
          ) : (
            <Button variant='dark' disabled>
              <Spinner size='xs' />
            </Button>
          )}
        </div>
      </nav>
    </Container>
  );
}

export default Header;
