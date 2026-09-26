import React, {
  type ChangeEvent,
  type HTMLAttributes,
  type ReactElement,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import Check from 'components/ui/Check';
import Spinner from 'components/ui/Spinner';
import { createMessageToast } from 'components/ui/ToastContainer';

import { TelegramBotsService } from 'api';

import { useTelegramBotContentStore } from '../store';

export interface PrivateSwitchProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {}

function PrivateSwitch(props: PrivateSwitchProps): ReactElement {
  const { t } = useTranslation('components', {
    keyPrefix: 'telegramBotContent.table.private',
  });

  const telegramBot = useTelegramBotContentStore((state) => state.telegramBot);
  const setTelegramBot = useTelegramBotContentStore((state) => state.setTelegramBot);

  const [loading, setLoading] = useState<boolean>(false);

  async function handleChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    setLoading(true);

    const { data, error } = await TelegramBotsService.partialUpdateTelegramBot({
      path: { id: telegramBot.id },
      body: { is_private: event.target.checked },
    });

    if (error || !data) {
      createMessageToast({
        message: t('messages.updateTelegramBotPrivate.error', {
          context: event.target.checked ? 'true' : 'false',
        }),
        level: 'error',
      });
    } else {
      setTelegramBot(data);
      createMessageToast({
        message: t('messages.updateTelegramBotPrivate.success', {
          context: data.is_private ? 'true' : 'false',
        }),
        level: 'success',
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
