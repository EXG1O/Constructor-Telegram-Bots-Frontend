import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Block, { BlockProps } from '../../Block';
import VariablesInfoText from '../../VariablesInfoText';
import TelegramRichInputLayout, { FORMATS } from 'components/shared/TelegramRichInputLayout';
import FormRichInputFeedback from 'components/shared/FormRichInputFeedback';

export interface Message {
  text: string;
}

export type MessageBlockProps = Pick<BlockProps, 'className'>;

export const defaultMessage: Message = { text: '' };

function MessageBlock(props: MessageBlockProps): ReactElement<MessageBlockProps> {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'commandOffcanvas.messageBlock',
  });

  return (
    <Block {...props} title={t('title')} body>
      <FormRichInputFeedback
        name='message.text'
        height='220px'
        formats={FORMATS}
        placeholder={t('messageEditorPlaceholder')}
      >
        <TelegramRichInputLayout />
      </FormRichInputFeedback>
      <VariablesInfoText />
    </Block>
  );
}

export default memo(MessageBlock);
