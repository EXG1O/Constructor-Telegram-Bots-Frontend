import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import { RouteID } from 'routes';

import Block, { BlockProps } from 'components/ui/Block';

import PartItem, { defaultPart, Part } from './components/PartItem';

import VariablesInfoText from '../../../VariablesInfoText';

import cn from 'utils/cn';

export type Parts = Part[];

export interface PartsBlockFormValues {
  parts: Parts;
}

export interface PartsBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

export const defaultParts: Parts = [defaultPart];
export const defaultPartsBlockFormValues: PartsBlockFormValues = {
  parts: defaultParts,
};

function PartsBlock({ className, ...props }: PartsBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'conditionOffcanvas.partsBlock',
  });

  const [{ value: parts }] = useField<Parts>('parts');

  return (
    <Block
      {...props}
      variant='light'
      className={cn('flex', 'flex-col', 'gap-2', className)}
    >
      <Block.Title>
        <h3 className='text-lg font-medium'>{t('title')}</h3>
      </Block.Title>
      <div className='flex w-full flex-col gap-1'>
        {parts.map((_, index) => (
          <PartItem key={index} index={index} />
        ))}
        <VariablesInfoText />
      </div>
    </Block>
  );
}

export default PartsBlock;
