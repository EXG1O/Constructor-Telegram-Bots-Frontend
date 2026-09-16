import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import type { RouteID } from 'routes';

import FormSimpleInputFeedback from 'components/shared/FormSimpleInputFeedback';
import Block, { type BlockProps } from 'components/ui/Block';
import SimpleInput from 'components/ui/SimpleInput';

import cn from 'utils/cn';

export interface DurationBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

function DurationBlock({ className, ...props }: DurationBlockProps): ReactElement {
  const { t } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'timerOffcanvas.durationBlock' },
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
      <div className='flex w-full items-start'>
        <FormSimpleInputFeedback
          name='duration'
          inputMode='numeric'
          placeholder={t('input.placeholder')}
        >
          <SimpleInput.Container className='flex-auto rounded-r-none'>
            <SimpleInput.Editor />
          </SimpleInput.Container>
        </FormSimpleInputFeedback>
        <span className='rounded-r-md border border-s-0 border-outline px-3 py-1.5'>
          {t('input.label')}
        </span>
      </div>
    </Block>
  );
}

export default DurationBlock;
