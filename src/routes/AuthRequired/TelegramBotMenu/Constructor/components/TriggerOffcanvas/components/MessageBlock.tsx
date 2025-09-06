import React, { lazy, ReactElement, Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormSimpleInputFeedback from 'components/shared/FormSimpleInputFeedback';
import Block, { BlockProps } from 'components/ui/Block';
import SimpleInput from 'components/ui/SimpleInput';
import Spinner from 'components/ui/Spinner';

import cn from 'utils/cn';

const ToolbarVariablesButton = lazy(
  () =>
    import(
      'components/shared/TelegramSimpleInputLayout/components/ToolbarVariablesButton'
    ),
);

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
    keyPrefix: 'triggerOffcanvas.messageBlock',
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
      <FormSimpleInputFeedback
        name='message.text'
        placeholder={t('messageEditorPlaceholder')}
      >
        <SimpleInput.Container>
          <SimpleInput.Toolbar className='justify-end'>
            <Suspense fallback={<Spinner size='3xs' />}>
              <ToolbarVariablesButton />
            </Suspense>
          </SimpleInput.Toolbar>
          <SimpleInput.Editor asChild>
            <textarea rows={8} className='resize-none' />
          </SimpleInput.Editor>
        </SimpleInput.Container>
      </FormSimpleInputFeedback>
    </Block>
  );
}

export default MessageBlock;
