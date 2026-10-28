import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import type { RouteID } from 'routes';

import FormSelectFeedback from 'components/shared/FormSelectFeedback';
import Block, { type BlockProps } from 'components/ui/Block';

import { ActionMessageDeletionTarget } from 'api';

import cn from 'utils/cn';

export interface MessageDeletionBlockProps extends Omit<
  BlockProps,
  'variant' | 'children'
> {}

function MessageDeletionBlock({
  className,
  ...props
}: MessageDeletionBlockProps): ReactElement {
  const { t } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'actionOffcanvas.messageDeletionBlock' },
  );

  return (
    <Block
      {...props}
      variant='light'
      className={cn('flex', 'flex-col', 'gap-2', className)}
    >
      <Block.Title>
        <h3 className='text-lg font-medium'>{t('title')}</h3>
      </Block.Title>
      <FormSelectFeedback name='message_deletion.target'>
        <option value={ActionMessageDeletionTarget.UserMessage}>
          {t('targets.userMessage')}
        </option>
        <option value={ActionMessageDeletionTarget.LastBotMessages}>
          {t('targets.lastBotMessages')}
        </option>
      </FormSelectFeedback>
    </Block>
  );
}

export default MessageDeletionBlock;
