import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormSelectFeedback from 'components/shared/FormSelectFeedback';
import Block, { type BlockProps } from 'components/ui/Block';

import cn from 'utils/cn';

import type { Interval } from './types';

export interface IntervalBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

const intervals: Interval[] = [1, 3, 7, 14, 28];

function IntervalBlock(props: IntervalBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'backgroundTaskOffcanvas.intervalBlock',
  });

  return (
    <Block {...props} variant='light' className={cn('flex', 'flex-col', 'gap-2')}>
      <Block.Title>
        <h3 className='text-lg font-medium'>{t('title')}</h3>
      </Block.Title>
      <FormSelectFeedback name='interval'>
        {intervals.map((interval, index) => (
          <option key={index} value={interval}>
            {t(`select.${interval}`)}
          </option>
        ))}
      </FormSelectFeedback>
    </Block>
  );
}

export default IntervalBlock;
