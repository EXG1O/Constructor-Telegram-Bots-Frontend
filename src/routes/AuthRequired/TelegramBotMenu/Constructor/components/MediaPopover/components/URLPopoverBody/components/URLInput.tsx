import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import SimpleInputFeedback, {
  type SimpleInputFeedbackProps,
} from 'components/shared/SimpleInputFeedback';

import { useMediaPopoverStore } from '../../../store';

export interface URLInputProps extends Omit<
  SimpleInputFeedbackProps,
  'size' | 'value' | 'error' | 'placeholder' | 'children' | 'onChange'
> {}

function URLInput(props: URLInputProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'mediaPopover.urlPopoverBody.urlInput',
  });

  const url = useMediaPopoverStore((state) => state.url!);
  const setURL = useMediaPopoverStore((state) => state.setURL);
  const error = useMediaPopoverStore<string | undefined>((state) => state.errors.url);

  return (
    <SimpleInputFeedback
      {...props}
      size='sm'
      value={url}
      error={error}
      placeholder={t('placeholder')}
      onChange={setURL}
    />
  );
}

export default URLInput;
