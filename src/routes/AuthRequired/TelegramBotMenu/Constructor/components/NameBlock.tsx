import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormInputFeedback from 'components/shared/FormInputFeedback';

import Block, { BlockProps } from './Block';

export type Name = string;

export type NameBlockProps = Pick<BlockProps, 'className'>;

export const defaultName: Name = '';

function NameBlock(props: NameBlockProps): ReactElement<NameBlockProps> {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'nameBlock',
  });

  return (
    <Block {...props} title={t('title')} body>
      <FormInputFeedback name='name' placeholder={t('inputPlaceholder')} />
    </Block>
  );
}

export default NameBlock;
