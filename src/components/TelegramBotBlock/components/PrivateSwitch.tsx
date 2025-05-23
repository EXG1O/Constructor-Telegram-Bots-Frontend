import React, {
  ChangeEvent,
  HTMLAttributes,
  memo,
  ReactElement,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import Check from 'components/ui/Check';
import Spinner from 'components/ui/Spinner';
import { createMessageToast } from 'components/ui/ToastContainer';

import useTelegramBot from '../hooks/useTelegramBot';

import { TelegramBotAPI } from 'api/telegram_bots/main';

export type PrivateSwitchProps = Pick<HTMLAttributes<HTMLElement>, 'className'>;

function PrivateSwitch(props: PrivateSwitchProps): ReactElement<PrivateSwitchProps> {
  const { t } = useTranslation('components', {
    keyPrefix: 'telegramBotBlock.table.private',
  });

  const [telegramBot, setTelegramBot] = useTelegramBot();

  const [loading, setLoading] = useState<boolean>(false);

  async function handleChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    setLoading(true);

    const response = await TelegramBotAPI.partialUpdate(telegramBot.id, {
      is_private: event.target.checked,
    });

    if (response.ok) {
      setTelegramBot(response.json);
      createMessageToast({
        message: t('messages.updateTelegramBotPrivate.success', {
          context: String(response.json.is_private),
        }),
        level: 'success',
      });
    } else {
      createMessageToast({
        message: t('messages.updateTelegramBotPrivate.error', {
          context: String(event.target.checked),
        }),
        level: 'error',
      });
    }

    setLoading(false);
  }

  return !loading ? (
    <Check
      {...props}
      type='switch'
      checked={telegramBot.is_private}
      onChange={handleChange}
    />
  ) : (
    <Spinner size='xxs' />
  );
}

export default memo(PrivateSwitch);
