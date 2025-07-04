import React, { ReactElement } from 'react';
import { useField } from 'formik';

import { Images } from '..';

import Carousel, { CarouselProps } from 'components/ui/Carousel';
import Spinner from 'components/ui/Spinner';

import { useCommandOffcanvasStore } from '../../../store';

export interface ImageCarouselProps
  extends Omit<CarouselProps, 'height' | 'children'> {}

function ImageCarousel(props: ImageCarouselProps): ReactElement | null {
  const [{ value: images }] = useField<Images>('images');

  const loading = useCommandOffcanvasStore((state) => state.imagesLoading);

  return loading || images.length ? (
    <Carousel {...props} height='200px'>
      {!loading ? (
        images.map((image) => (
          <Carousel.Item key={image.key} className='bg-white'>
            <Carousel.Item.Image src={image.url} />
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

export default ImageCarousel;
