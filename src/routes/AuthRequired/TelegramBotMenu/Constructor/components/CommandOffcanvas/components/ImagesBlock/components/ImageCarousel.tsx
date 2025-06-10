import React, { memo, ReactElement } from 'react';
import { useField } from 'formik';

import { Images } from '..';

import Carousel, { CarouselProps } from 'components/ui/Carousel';

export type ImageCarouselProps = Pick<CarouselProps, 'className'>;

function ImageCarousel({
  className,
  ...props
}: ImageCarouselProps): ReactElement | null {
  const [{ value: images }] = useField<Images>('images');

  return images.length ? (
    <Carousel {...props} height='200px'>
      {images.map((image) => (
        <Carousel.Item key={image.key}>
          <Carousel.Item.Image src={image.url} />
        </Carousel.Item>
      ))}
    </Carousel>
  ) : null;
}

export default memo(ImageCarousel);
