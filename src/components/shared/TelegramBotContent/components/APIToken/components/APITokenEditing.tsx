import React, { HTMLAttributes, ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X } from 'lucide-react';

import SimpleInputFeedback, {
  SimpleInputFeedbackProps,
} from 'components/shared/SimpleInputFeedback';
import IconButton from 'components/ui/IconButton';
import Spinner from 'components/ui/Spinner';
import { createMessageToast } from 'components/ui/ToastContainer';

import useTelegramBotContentStore from '../../../hooks/useTelegramBotContentStore';

import { TelegramBotAPI } from 'api/telegram-bots/telegram-bot';

import cn from 'utils/cn';

const inputWrapperProps: SimpleInputFeedbackProps['wrapperProps'] = {
  className: 'flex-auto',
};

export interface APITokenEditingProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

function APITokenEditing({ className, ...props }: APITokenEditingProps): ReactElement {
  const { t } = useTranslation('components', {
    keyPrefix: 'telegramBotContent.table.apiToken',
  });

  const telegramBot = useTelegramBotContentStore((state) => state.telegramBot);
  const setTelegramBot = useTelegramBotContentStore((state) => state.setTelegramBot);
  const toggleAPITokenState = useTelegramBotContentStore(
    (state) => state.toggleAPITokenState,
  );

  const [value, setValue] = useState<string>(telegramBot.api_token);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setValue(telegramBot.api_token), [telegramBot.api_token]);

  async function handleSaveClick(): Promise<void> {
    setLoading(true);

    const response = await TelegramBotAPI.partialUpdate(telegramBot.id, {
      api_token: value,
    });

    if (response.ok) {
      setTelegramBot(response.json);
      toggleAPITokenState();
      createMessageToast({
        message: t('messages.updateTelegramBotAPIToken.success'),
        level: 'success',
      });
    } else {
      setError(
        response.json.errors.find((error) => error.attr === 'api_token')?.detail ??
          null,
      );
      createMessageToast({
        message: t('messages.updateTelegramBotAPIToken.error'),
        level: 'error',
      });
    }

    setLoading(false);
  }

  function handleCancelClick(): void {
    toggleAPITokenState();
  }

  return (
    <div
      {...props}
      className={cn('flex', 'items-center', 'w-full', 'gap-2', className)}
    >
      {!loading ? (
        <>
          <SimpleInputFeedback
            autoFocus
            size='sm'
            value={value}
            error={error ?? undefined}
            wrapperProps={inputWrapperProps}
            placeholder={t('inputPlaceholder')}
            onChange={setValue}
          />
          <div className='flex gap-0.5'>
            <IconButton size='lg' className='text-success' onClick={handleSaveClick}>
              <Check />
            </IconButton>
            <IconButton size='lg' className='text-danger' onClick={handleCancelClick}>
              <X />
            </IconButton>
          </div>
        </>
      ) : (
        <Spinner size='2xs' />
      )}
    </div>
  );
}

export default APITokenEditing;
