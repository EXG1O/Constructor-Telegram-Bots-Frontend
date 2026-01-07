import React, { ReactElement } from 'react';

import { Images } from '..';

import Carousel, { CarouselProps } from 'components/ui/Carousel';
import Spinner from 'components/ui/Spinner';

import ImageCarouselImage from './ImageCarouselImage';

import { useMessageOffcanvasStore } from '../../../store';

export interface ImageCarouselInnerProps
  extends Omit<CarouselProps, 'height' | 'children'> {
  images: Images;
}

function ImageCarouselInner({
  images,
  ...props
}: ImageCarouselInnerProps): ReactElement | null {
  const loading = useMessageOffcanvasStore((state) => state.imagesLoading);

  return loading || images.length ? (
    <Carousel {...props} height='200px'>
      {!loading ? (
        images.map((image) => (
          <Carousel.Item key={image.key} className='bg-white'>
            <ImageCarouselImage image={image} />
          </Carousel.Item>
        ))
      ) : (
        <Carousel.Item className='flex items-center justify-center bg-white'>
          <Spinner size='sm' />
        </Carousel.Item>
      )}
    </Carousel>
  ) : null;
}

export default ImageCarouselInner;
