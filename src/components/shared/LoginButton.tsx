import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { reverse, RouteID } from 'routes';

import Button, { ButtonProps, buttonVariants } from 'components/ui/Button';
import Spinner from 'components/ui/Spinner';
import { createMessageToast } from 'components/ui/ToastContainer';

import settings from 'settings';

import Telegram from 'assets/icons/telegram.svg';

import { UsersAPI } from 'api/users';
import { Data } from 'api/users/types';

export { buttonVariants as loginButtonVariants };

type AuthData = Data.UsersAPI.Login;

declare global {
  interface Window {
    Telegram: {
      Login: {
        init: (
          options?: Record<string, any>,
          callback?: (authData: AuthData | false) => void,
        ) => void;
        open: () => void;
      };
    };
  }
}

export interface LoginButtonProps extends ButtonProps {}

const LoginButton = forwardRef<HTMLButtonElement, LoginButtonProps>(
  ({ disabled, children, ...props }, ref) => {
    const { t } = useTranslation('components', { keyPrefix: 'loginButton' });

    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(true);

    const internalRef = useRef<HTMLButtonElement | null>(null);

    function setRefs(element: HTMLButtonElement | null): void {
      internalRef.current = element;

      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    }

    async function login(authData: AuthData | false): Promise<void> {
      if (!authData) return;

      setLoading(true);

      const response = await UsersAPI.login(authData);

      if (!response.ok) {
        createMessageToast({
          message: t('messages.userLogin.error'),
          level: 'error',
        });
        setLoading(false);
        return;
      }

      createMessageToast({
        message: t('messages.userLogin.success'),
        level: 'success',
      });
      navigate(reverse(RouteID.TelegramBots));
    }

    useEffect(() => {
      const createScript = (): void => {
        if (internalRef.current) {
          if (settings.ENABLE_TELEGRAM_AUTH) {
            const script = document.createElement('script');
            script.src = `https://telegram.org/js/telegram-widget.js?22`;
            script.onload = () => {
              window.Telegram.Login.init(
                {
                  bot_id: settings.TELEGRAM_BOT_ID,
                  request_access: 'write',
                },
                login,
              );
              internalRef.current!.onclick = () => window.Telegram.Login.open();
              setLoading(false);
            };
            internalRef.current.appendChild(script);
          } else {
            internalRef.current.onclick = () =>
              login({
                id: 1,
                first_name: 'Anonymous',
                auth_date: 0,
                hash: '*'.repeat(64),
              });
            setLoading(false);
          }
        } else {
          setTimeout(createScript, 500);
        }
      };

      createScript();
    }, []);

    return (
      <Button {...props} ref={setRefs} disabled={loading || disabled}>
        {!loading ? (
          (children ?? (
            <>
              <Telegram />
              {t('text')}
            </>
          ))
        ) : (
          <Spinner size='xxs' />
        )}
      </Button>
    );
  },
);
LoginButton.displayName = 'LoginButton';

export default LoginButton;
