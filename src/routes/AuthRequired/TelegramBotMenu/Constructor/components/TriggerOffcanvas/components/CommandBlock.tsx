import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormInputFeedback from 'components/shared/FormInputFeedback';
import Block, { BlockProps } from 'components/ui/Block';

import FormToggleSection from '../../FormToggleSection';

import cn from 'utils/cn';

export interface Command {
  command: string;
  description: string;
}

export interface CommandBlockFormValues {
  command: Command;
  show_command_description: boolean;
}

export interface CommandBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

export const defaultCommand: Command = { command: '', description: '' };
export const defaultCommandBlockFormValues: CommandBlockFormValues = {
  command: defaultCommand,
  show_command_description: false,
};

function CommandBlock({ className, ...props }: CommandBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'triggerOffcanvas.commandBlock',
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
      <div className='flex w-full items-start'>
        <span className='rounded-s-md border border-outline px-3 py-1.5 font-semibold'>
          /
        </span>
        <FormInputFeedback
          name='command.command'
          placeholder={t('commandInputPlaceholder')}
          className='-ms-px flex-auto rounded-s-none'
        />
      </div>
      <FormToggleSection advanced name='show_command_description' className='w-full'>
        <FormToggleSection.TriggerButton
          size='sm'
          openProps={{ children: t('description.hideButton') }}
          closedProps={{ children: t('description.showButton') }}
        />
        <FormToggleSection.Body>
          <FormInputFeedback
            size='sm'
            name='command.description'
            placeholder={t('description.inputPlaceholder')}
            className='rounded-t-none border-t-0'
          />
        </FormToggleSection.Body>
      </FormToggleSection>
    </Block>
  );
}

export default CommandBlock;
