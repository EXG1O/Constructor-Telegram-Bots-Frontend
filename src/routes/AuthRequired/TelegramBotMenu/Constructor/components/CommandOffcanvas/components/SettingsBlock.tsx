import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormCheckFeedback from 'components/shared/FormCheckFeedback';
import Block, { BlockProps } from 'components/ui/Block';

import cn from 'utils/cn';

export interface Settings {
  is_reply_to_user_message: boolean;
  is_delete_user_message: boolean;
  is_send_as_new_message: boolean;
}

export interface SettingsBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

export const defaultSettings: Settings = {
  is_reply_to_user_message: false,
  is_delete_user_message: false,
  is_send_as_new_message: false,
};

function SettingsBlock({ className, ...props }: SettingsBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'commandOffcanvas.settingsBlock',
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
        name='settings.is_reply_to_user_message'
        label={t('replyToUserMessageSwitch')}
      />
      <FormCheckFeedback
        type='switch'
        name='settings.is_delete_user_message'
        label={t('deleteUserMessageSwitch')}
      />
      <FormCheckFeedback
        type='switch'
        name='settings.is_send_as_new_message'
        label={t('sendAsNewMessageSwitch')}
      />
    </Block>
  );
}

export default SettingsBlock;
