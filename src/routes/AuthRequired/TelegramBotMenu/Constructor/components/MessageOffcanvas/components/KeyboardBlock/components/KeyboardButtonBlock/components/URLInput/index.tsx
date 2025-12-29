import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import SimpleInputFeedback, {
  SimpleInputFeedbackProps,
} from 'components/shared/SimpleInputFeedback';
import SimpleInput from 'components/ui/SimpleInput';

import ToggleInnerSection from './components/ToggleInnerSection';
import ToggleSection from './components/ToggleSection';

import { useMessageOffcanvasStore } from '../../../../../../store';

export type URL = string;

export interface URLInputProps
  extends Omit<
    SimpleInputFeedbackProps,
    'size' | 'value' | 'error' | 'placeholder' | 'children' | 'onChange'
  > {}

export const defaultURL: URL = '';

function URLInput(props: URLInputProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'messageOffcanvas.keyboardBlock.keyboardButtonBlock.urlInput',
  });

  const url = useMessageOffcanvasStore((state) => state.keyboardButtonBlock.url);
  const setURL = useMessageOffcanvasStore((state) => state.keyboardButtonBlock.setURL);
  const error = useMessageOffcanvasStore(
    (state) => state.keyboardButtonBlock.errors.url,
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

export default Object.assign(URLInput, { ToggleSection, ToggleInnerSection });
