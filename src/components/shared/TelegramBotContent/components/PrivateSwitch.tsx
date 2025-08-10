import React, { ChangeEvent, HTMLAttributes, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Check from 'components/ui/Check';
import Spinner from 'components/ui/Spinner';
import { createMessageToast } from 'components/ui/ToastContainer';

import useTelegramBotContentStore from '../hooks/useTelegramBotContentStore';

import { TelegramBotAPI } from 'api/telegram-bots/telegram-bot';

export interface PrivateSwitchProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

function PrivateSwitch(props: PrivateSwitchProps): ReactElement {
  const { t } = useTranslation('components', {
    keyPrefix: 'telegramBotContent.table.private',
  });

  const telegramBot = useTelegramBotContentStore((state) => state.telegramBot);
  const setTelegramBot = useTelegramBotContentStore((state) => state.setTelegramBot);

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
    <Spinner size='2xs' />
  );
}

export default PrivateSwitch;
