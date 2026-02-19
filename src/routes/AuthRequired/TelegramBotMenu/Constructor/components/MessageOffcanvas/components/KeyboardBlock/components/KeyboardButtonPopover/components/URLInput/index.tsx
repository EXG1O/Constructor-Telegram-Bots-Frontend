import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import SimpleInputFeedback, {
  SimpleInputFeedbackProps,
} from 'components/shared/SimpleInputFeedback';
import SimpleInput from 'components/ui/SimpleInput';

import ToggleSection from './components/ToggleInnerSection';

import { useKeyboardButtonPopoverStore } from '../../store';

export type URL = string;

export interface URLInputProps
  extends Omit<
    SimpleInputFeedbackProps,
    'size' | 'value' | 'error' | 'placeholder' | 'children' | 'onChange'
  > {}

export const defaultURL: URL = '';

function URLInput(props: URLInputProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'messageOffcanvas.keyboardBlock.keyboardButtonPopover.urlInput',
  });

  const url = useKeyboardButtonPopoverStore((state) => state.url);
  const setURL = useKeyboardButtonPopoverStore((state) => state.setURL);
  const error = useKeyboardButtonPopoverStore<string | undefined>(
    (state) => state.errors.url,
  );

  return (
    <SimpleInputFeedback
      {...props}
      size='sm'
      inputMode='url'
      value={url}
      error={error}
      placeholder={t('placeholder')}
      onChange={setURL}
    >
      <SimpleInput.Container className='rounded-t-none border-t-0'>
        <SimpleInput.Editor />
      </SimpleInput.Container>
    </SimpleInputFeedback>
  );
}

export default Object.assign(URLInput, { ToggleSection });
