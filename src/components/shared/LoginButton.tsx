import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Button, { type ButtonProps, buttonVariants } from 'components/ui/Button';
import { createMessageToast } from 'components/ui/ToastContainer';

import settings from 'settings';

import Telegram from 'assets/icons/telegram.svg';

import { UsersAPI } from 'api/users';

import reverse from 'utils/reverse';

export { buttonVariants as loginButtonVariants };

export interface LoginButtonProps extends Omit<ButtonProps, 'variant' | 'children'> {}

export const TELEGRAM_LOGIN_REDIRECT_URI: string =
  location.origin + reverse(RouteID.Login);

const LoginButton = forwardRef<HTMLButtonElement, LoginButtonProps>((props, ref) => {
  const { t } = useTranslation('components', { keyPrefix: 'loginButton' });

  async function handleClick(): Promise<void> {
    const response = await UsersAPI.loginInit();

    if (!response.ok) {
      createMessageToast({
        message: t('messages.loginInit.error'),
        level: 'error',
      });
      return;
    }

    const { code_challenge } = response.json;

    const params = new URLSearchParams({
      response_type: 'code',
      scope: 'openid profile telegram:bot_access',
      client_id: settings.TELEGRAM_LOGIN_CLIENT_ID.toString(),
      code_challenge,
      code_challenge_method: 'S256',
      redirect_uri: TELEGRAM_LOGIN_REDIRECT_URI,
    });

    location.href = `https://oauth.telegram.org/auth?${params.toString()}`;
  }

  return (
    <Button {...props} ref={ref} variant='dark' onClick={handleClick}>
      <Telegram />
      {t('text')}
    </Button>
  );
});
LoginButton.displayName = 'LoginButton';

export default LoginButton;
