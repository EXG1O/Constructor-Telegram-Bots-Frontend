import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import AddImagesButton from './components/AddImagesButton';
import ImageCarousel from './components/ImageCarousel';
import ImageList from './components/ImageList';
import ImagesLoading from './components/ImagesLoading';

import Block, { BlockProps } from '../../../Block';

export interface Image {
  id?: number;
  key: string;
  name: string;
  size: number;
  url: string;
  file: File | null;
  from_url: string | null;
}

export type Images = Image[];

export type ImagesBlockProps = Pick<BlockProps, 'className'>;

export const defaultImages: Images = [];

function ImagesBlock(props: ImagesBlockProps): ReactElement<ImagesBlockProps> {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'commandOffcanvas.imagesBlock',
  });

  return (
    <Block.Collapse name='show_images_block'>
      <Block {...props} title={t('title')}>
        <Block.Body className='flex flex-col gap-2'>
          <ImagesLoading>
            <ImageCarousel />
            <ImageList />
          </ImagesLoading>
          <AddImagesButton />
        </Block.Body>
      </Block>
    </Block.Collapse>
  );
}

export default memo(ImagesBlock);
