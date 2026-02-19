import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import SimpleInputFeedback, {
  SimpleInputFeedbackProps,
} from 'components/shared/SimpleInputFeedback';

import { useKeyboardButtonPopoverStore } from '../store';

export type Text = string;

export interface TextInputProps
  extends Omit<
    SimpleInputFeedbackProps,
    'size' | 'value' | 'error' | 'placeholder' | 'children' | 'onChange'
  > {}

export const defaultText: Text = '';

function TextInput(props: TextInputProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'messageOffcanvas.keyboardBlock.keyboardButtonPopover.textInput',
  });

  const text = useKeyboardButtonPopoverStore((state) => state.text);
  const setText = useKeyboardButtonPopoverStore((state) => state.setText);
  const error = useKeyboardButtonPopoverStore<string | undefined>(
    (state) => state.errors.text,
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
