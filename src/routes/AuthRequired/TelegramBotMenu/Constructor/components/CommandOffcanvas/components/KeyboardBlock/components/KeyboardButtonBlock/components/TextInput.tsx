import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import InputFeedback, { InputFeedbackProps } from 'components/InputFeedback';

import { useCommandOffcanvasStore } from '../../../../../store';

export type TextInputProps = Omit<
  InputFeedbackProps,
  'size' | 'value' | 'placeholder' | 'children' | 'onChange'
>;

export type Text = string;

export const defaultText: Text = '';

function TextInput(props: TextInputProps): ReactElement<TextInputProps> {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'commandOffcanvas.keyboardBlock.keyboardButtonBlock.textInput',
  });

  const text = useCommandOffcanvasStore((state) => state.keyboardButtonBlock.text);
  const setText = useCommandOffcanvasStore(
    (state) => state.keyboardButtonBlock.setText,
  );
  const error = useCommandOffcanvasStore(
    (state) => state.keyboardButtonBlock.errors.text,
  );

  return (
    <InputFeedback
      {...props}
      size='sm'
      value={text}
      error={error}
      placeholder={t('placeholder')}
      onChange={(e) => setText(e.target.value)}
    />
  );
}

export default memo(TextInput);
