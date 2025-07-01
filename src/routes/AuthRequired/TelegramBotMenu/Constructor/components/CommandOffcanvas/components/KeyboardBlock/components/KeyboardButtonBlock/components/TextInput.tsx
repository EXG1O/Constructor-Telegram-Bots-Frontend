import React, { ChangeEvent, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import InputFeedback, { InputFeedbackProps } from 'components/shared/InputFeedback';

import { useCommandOffcanvasStore } from '../../../../../store';

export type Text = string;

export interface TextInputProps
  extends Omit<
    InputFeedbackProps,
    'size' | 'value' | 'error' | 'placeholder' | 'children' | 'onChange'
  > {}

export const defaultText: Text = '';

function TextInput(props: TextInputProps): ReactElement {
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

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setText(event.target.value);
  }

  return (
    <InputFeedback
      {...props}
      size='sm'
      value={text}
      error={error}
      placeholder={t('placeholder')}
      onChange={handleChange}
    />
  );
}

export default TextInput;
