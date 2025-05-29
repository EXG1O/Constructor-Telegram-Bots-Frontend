import React, {
  ChangeEvent,
  HTMLAttributes,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X } from 'lucide-react';

import InputFeedback, { InputFeedbackProps } from 'components/shared/InputFeedback';
import IconButton from 'components/ui/IconButton';
import Spinner from 'components/ui/Spinner';
import { createMessageToast } from 'components/ui/ToastContainer';

import useTelegramBot from '../hooks/useTelegramBot';

import { TelegramBotAPI } from 'api/telegram_bots/main';

import cn from 'utils/cn';

const inputWrapperProps: InputFeedbackProps['wrapperProps'] = {
  className: 'flex-auto',
};

export interface APITokenEditingProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  onSaved: () => void;
  onCancel: () => void;
}

function APITokenEditing({
  className,
  onSaved,
  onCancel,
  ...props
}: APITokenEditingProps): ReactElement<APITokenEditingProps> {
  const { t } = useTranslation('components', {
    keyPrefix: 'telegramBotBlock.table.apiToken',
  });

  const [telegramBot, setTelegramBot] = useTelegramBot();

  const [value, setValue] = useState<string>(telegramBot.api_token);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setValue(telegramBot.api_token), [telegramBot.api_token]);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    setValue(event.target.value);
  }

  async function handleSaveClick(): Promise<void> {
    setLoading(true);

    const response = await TelegramBotAPI.partialUpdate(telegramBot.id, {
      api_token: value,
    });

    if (response.ok) {
      onSaved();
      setTelegramBot(response.json);
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
    onCancel();
  }

  return (
    <div {...props} className={cn('flex', 'items-center', 'gap-2', className)}>
      {!loading ? (
        <>
          <InputFeedback
            autoFocus
            size='sm'
            value={value}
            error={error ?? undefined}
            wrapperProps={inputWrapperProps}
            placeholder={t('inputPlaceholder')}
            onChange={handleInputChange}
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
        <Spinner size='xxs' />
      )}
    </div>
  );
}

export default APITokenEditing;
