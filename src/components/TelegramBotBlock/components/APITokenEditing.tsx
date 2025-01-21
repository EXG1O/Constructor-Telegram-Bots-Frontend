import React, {
  ChangeEvent,
  CSSProperties,
  HTMLAttributes,
  memo,
  ReactElement,
  SVGProps,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import InputFeedback, { InputFeedbackProps } from 'components/InputFeedback';
import Loading from 'components/Loading';
import { createMessageToast } from 'components/ToastContainer';

import useTelegramBot from '../hooks/useTelegramBot';

import CheckIcon from 'assets/icons/check.svg';
import XIcon from 'assets/icons/x.svg';

import { TelegramBotAPI } from 'api/telegram_bots/main';

const inputStyle: CSSProperties = { fontSize: '16px' };
const iconProps: SVGProps<SVGSVGElement> = { width: 28, height: 28, cursor: 'pointer' };
const inputContainerProps: InputFeedbackProps['containerProps'] = {
  className: 'flex-fill',
};

export interface APITokenEditingProps
  extends Pick<HTMLAttributes<HTMLElement>, 'className'> {
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

  async function handleSave(): Promise<void> {
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

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setValue(event.target.value);
  }

  return (
    <div
      {...props}
      className={classNames('d-flex align-items-center gap-2', className)}
    >
      <InputFeedback
        autoFocus
        size='sm'
        value={value}
        error={error ?? undefined}
        containerProps={inputContainerProps}
        placeholder={t('inputPlaceholder')}
        style={inputStyle}
        onChange={handleChange}
      />
      <div className='d-flex'>
        {!loading ? (
          <CheckIcon {...iconProps} className='text-success' onClick={handleSave} />
        ) : (
          <Loading size='xxs' />
        )}
        <XIcon {...iconProps} className='text-danger' onClick={onCancel} />
      </div>
    </div>
  );
}

export default memo(APITokenEditing);
