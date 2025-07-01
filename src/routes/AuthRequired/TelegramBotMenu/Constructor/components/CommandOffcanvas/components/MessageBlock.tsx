import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormRichInputFeedback from 'components/shared/FormRichInputFeedback';
import TelegramRichInputLayout, {
  FORMATS,
} from 'components/shared/TelegramRichInputLayout';
import Block, { BlockProps } from 'components/ui/Block';

import VariablesInfoText from '../../VariablesInfoText';

import cn from 'utils/cn';

export interface Message {
  text: string;
}

export interface MessageBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

export const defaultMessage: Message = { text: '' };

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
      <h3 className='w-full text-center text-lg font-medium'>{t('title')}</h3>
      <div>
        <FormRichInputFeedback
          name='message.text'
          height='220px'
          formats={FORMATS}
          placeholder={t('messageEditorPlaceholder')}
        >
          <TelegramRichInputLayout />
        </FormRichInputFeedback>
        <VariablesInfoText />
      </div>
    </Block>
  );
}

export default MessageBlock;
