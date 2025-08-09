import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Button, { ButtonProps, buttonVariants } from 'components/ui/Button';

import settings from 'settings';

import Telegram from 'assets/icons/telegram.svg';

import reverse from 'utils/reverse';

export { buttonVariants as loginButtonVariants };

export interface LoginButtonProps extends Omit<ButtonProps, 'variant' | 'children'> {}

export const SELF_LOGIN_ENDPOINT: string = reverse(RouteID.Login);
export const TELEGRAM_LOGIN_URL: string = settings.ENABLE_TELEGRAM_AUTH
  ? [
      'https://oauth.telegram.org/auth',
      `?bot_id=${settings.TELEGRAM_BOT_ID}`,
      `&origin=${location.origin}`,
      '&request_access=write',
      `&return_to=${location.origin}${SELF_LOGIN_ENDPOINT}`,
    ].join('')
  : SELF_LOGIN_ENDPOINT +
    '#tgAuthResult=' +
    btoa(
      JSON.stringify({
        id: 1,
        first_name: 'Test user',
        auth_date: 0,
        hash: '*'.repeat(64),
      }),
    );

const LoginButton = forwardRef<HTMLButtonElement, LoginButtonProps>((props, ref) => {
  const { t } = useTranslation('components', { keyPrefix: 'loginButton' });

  return (
    <Button {...props} ref={ref} asChild variant='dark'>
      <a href={TELEGRAM_LOGIN_URL}>
        <Telegram />
        {t('text')}
      </a>
    </Button>
  );
});
LoginButton.displayName = 'LoginButton';

export default LoginButton;
