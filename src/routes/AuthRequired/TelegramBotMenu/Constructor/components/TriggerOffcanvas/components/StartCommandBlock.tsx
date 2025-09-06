import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormSimpleInputFeedback from 'components/shared/FormSimpleInputFeedback';
import Block, { BlockProps } from 'components/ui/Block';
import SimpleInput from 'components/ui/SimpleInput';

import FormToggleSection from '../../FormToggleSection';

import cn from 'utils/cn';

export interface StartCommand {
  payload: string;
  description: string;
}

export interface StartCommandBlockFormValues {
  start_command: StartCommand;
  show_start_command_payload: boolean;
  show_start_command_description: boolean;
}

export interface StartCommandBlockProps
  extends Omit<BlockProps, 'variant' | 'children'> {}

export const defaultStartCommand: StartCommand = { payload: '', description: '' };
export const defaultStartCommandBlockFormValues: StartCommandBlockFormValues = {
  start_command: defaultStartCommand,
  show_start_command_payload: false,
  show_start_command_description: false,
};

function StartCommandBlock({
  className,
  ...props
}: StartCommandBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'triggerOffcanvas.startCommandBlock',
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
      <FormToggleSection advanced name='show_start_command_payload' className='w-full'>
        <FormToggleSection.TriggerButton
          size='sm'
          openProps={{ children: t('payload.hideButton') }}
          closedProps={{ children: t('payload.showButton') }}
        />
        <FormToggleSection.Body>
          <FormSimpleInputFeedback
            size='sm'
            name='start_command.payload'
            placeholder={t('payload.inputPlaceholder')}
          >
            <SimpleInput.Container className='rounded-t-none border-t-0'>
              <SimpleInput.Editor />
            </SimpleInput.Container>
          </FormSimpleInputFeedback>
        </FormToggleSection.Body>
      </FormToggleSection>
      <FormToggleSection
        advanced
        name='show_start_command_description'
        className='w-full'
      >
        <FormToggleSection.TriggerButton
          size='sm'
          openProps={{ children: t('description.hideButton') }}
          closedProps={{ children: t('description.showButton') }}
        />
        <FormToggleSection.Body>
          <FormSimpleInputFeedback
            size='sm'
            name='start_command.description'
            placeholder={t('description.inputPlaceholder')}
          >
            <SimpleInput.Container className='rounded-t-none border-t-0'>
              <SimpleInput.Editor />
            </SimpleInput.Container>
          </FormSimpleInputFeedback>
        </FormToggleSection.Body>
      </FormToggleSection>
    </Block>
  );
}

export default StartCommandBlock;
