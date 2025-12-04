import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormRichInputFeedback from 'components/shared/FormRichInputFeedback';
import TelegramRichInputLayout, {
  FORMATS,
} from 'components/shared/TelegramRichInputLayout';
import Block, { BlockProps } from 'components/ui/Block';

import cn from 'utils/cn';

export type Text = string;

export interface TextBlockFormValues {
  text: Text;
}

export interface TextBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

export const defaultText: Text = '';
export const defaultTextBlockFormValues: TextBlockFormValues = {
  text: defaultText,
};

function TextBlock({ className, ...props }: TextBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'messageOffcanvas.textBlock',
  });

  return (
    <Block
      {...props}
      variant='light'
      className={cn('flex', 'flex-col', 'gap-2', className)}
    >
      <Block.Title>
        <h3 className='text-lg font-medium'>{t('title')}</h3>
      </Block.Title>
      <FormRichInputFeedback
        name='text'
        height='220px'
        formats={FORMATS}
        placeholder={t('editorPlaceholder')}
      >
        <TelegramRichInputLayout toolbarVariables />
      </FormRichInputFeedback>
    </Block>
  );
}

export default TextBlock;
