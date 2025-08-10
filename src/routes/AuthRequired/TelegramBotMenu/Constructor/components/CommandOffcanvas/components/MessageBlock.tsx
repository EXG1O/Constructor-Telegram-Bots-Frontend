import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormRichInputFeedback from 'components/shared/FormRichInputFeedback';
import TelegramRichInputLayout, {
  FORMATS,
} from 'components/shared/TelegramRichInputLayout';
import Block, { BlockProps } from 'components/ui/Block';

import cn from 'utils/cn';

export interface Message {
  text: string;
}

export interface MessageBlockFormValues {
  message: Message;
}

export interface MessageBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

export const defaultMessage: Message = { text: '' };
export const defaultMessageBlockFormValues: MessageBlockFormValues = {
  message: defaultMessage,
};

function MessageBlock({ className, ...props }: MessageBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'commandOffcanvas.messageBlock',
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
      <div>
        <FormRichInputFeedback
          name='message.text'
          height='220px'
          formats={FORMATS}
          placeholder={t('messageEditorPlaceholder')}
        >
          <TelegramRichInputLayout toolbarVariables />
        </FormRichInputFeedback>
      </div>
    </Block>
  );
}

export default MessageBlock;
