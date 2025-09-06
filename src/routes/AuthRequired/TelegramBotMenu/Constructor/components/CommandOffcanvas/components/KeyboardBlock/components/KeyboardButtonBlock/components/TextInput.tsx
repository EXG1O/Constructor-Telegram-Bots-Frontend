import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import SimpleInputFeedback, {
  SimpleInputFeedbackProps,
} from 'components/shared/SimpleInputFeedback';

import { useCommandOffcanvasStore } from '../../../../../store';

export type Text = string;

export interface TextInputProps
  extends Omit<
    SimpleInputFeedbackProps,
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

  return (
    <SimpleInputFeedback
      {...props}
      size='sm'
      value={text}
      error={error}
      placeholder={t('placeholder')}
      onChange={setText}
    />
  );
}

export default TextInput;
