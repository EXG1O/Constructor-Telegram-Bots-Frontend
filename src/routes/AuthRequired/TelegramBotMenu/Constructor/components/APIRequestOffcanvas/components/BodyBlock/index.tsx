import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormCodeInputFeedback from 'components/shared/FormCodeInputFeedback';
import TelegramCodeInputLayout from 'components/shared/TelegramCodeInputLayout';
import Block, { type BlockProps } from 'components/ui/Block';

import cn from 'utils/cn';

export interface BodyBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

function BodyBlock({ className, ...props }: BodyBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'apiRequestOffcanvas.bodyBlock',
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
      <FormCodeInputFeedback name='body' language='json'>
        <TelegramCodeInputLayout toolbarVariables />
      </FormCodeInputFeedback>
    </Block>
  );
}

export default BodyBlock;
