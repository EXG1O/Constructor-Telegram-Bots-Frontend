import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Block, { type BlockProps } from 'components/ui/Block';

import AddImagesButton from './components/AddImagesButton';
import ImageCarousel from './components/ImageCarousel';
import ImageList from './components/ImageList';

import cn from 'utils/cn';

export interface ImagesBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

function ImagesBlock({ className, ...props }: ImagesBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'messageOffcanvas.imagesBlock',
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
      <ImageCarousel />
      <ImageList />
      <AddImagesButton />
    </Block>
  );
}

export default ImagesBlock;
