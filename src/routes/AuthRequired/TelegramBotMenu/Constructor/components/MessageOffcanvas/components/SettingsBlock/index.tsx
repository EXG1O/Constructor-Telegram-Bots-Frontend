import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormCheckFeedback from 'components/shared/FormCheckFeedback';
import Block, { type BlockProps } from 'components/ui/Block';

import cn from 'utils/cn';

export interface SettingsBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

function SettingsBlock({ className, ...props }: SettingsBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'messageOffcanvas.settingsBlock',
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
      <FormCheckFeedback
        type='switch'
        name='settings.reply_to_user_message'
        label={t('replyToUserMessageSwitch')}
      />
      <FormCheckFeedback
        type='switch'
        name='settings.delete_user_message'
        label={t('deleteUserMessageSwitch')}
      />
      <FormCheckFeedback
        type='switch'
        name='settings.send_as_new_message'
        label={t('sendAsNewMessageSwitch')}
      />
    </Block>
  );
}

export default SettingsBlock;
