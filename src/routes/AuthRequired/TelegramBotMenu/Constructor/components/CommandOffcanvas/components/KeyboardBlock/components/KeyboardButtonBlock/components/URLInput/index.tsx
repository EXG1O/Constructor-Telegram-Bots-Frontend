import React, { ChangeEvent, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import InputFeedback, { InputFeedbackProps } from 'components/shared/InputFeedback';

import ToggleInnerSection from './components/ToggleInnerSection';
import ToggleSection from './components/ToggleSection';

import cn from 'utils/cn';

import { useCommandOffcanvasStore } from '../../../../../../store';

export type URL = string;

export interface URLInputProps
  extends Omit<
    InputFeedbackProps,
    'size' | 'value' | 'error' | 'placeholder' | 'children' | 'onChange'
  > {}

export const defaultURL: URL = '';

function URLInput({ className, ...props }: URLInputProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'commandOffcanvas.keyboardBlock.keyboardButtonBlock.urlInput',
  });

  const url = useCommandOffcanvasStore((state) => state.keyboardButtonBlock.url);
  const setURL = useCommandOffcanvasStore((state) => state.keyboardButtonBlock.setURL);
  const error = useCommandOffcanvasStore(
    (state) => state.keyboardButtonBlock.errors.url,
  );

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setURL(event.target.value);
  }

  return (
    <InputFeedback
      {...props}
      size='sm'
      value={url}
      error={error}
      className={cn('border-t-0', 'rounded-t-none', className)}
      placeholder={t('placeholder')}
      onChange={handleChange}
    />
  );
}

export default Object.assign(URLInput, { ToggleSection, ToggleInnerSection });
