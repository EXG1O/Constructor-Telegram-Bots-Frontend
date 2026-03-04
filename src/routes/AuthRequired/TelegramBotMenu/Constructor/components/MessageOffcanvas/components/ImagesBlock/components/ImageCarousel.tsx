import React, { type ReactElement } from 'react';
import { FastField, type FastFieldProps } from 'formik';

import ImageCarouselInner, { type ImageCarouselInnerProps } from './ImageCarouselInner';

export interface ImageCarouselProps extends Omit<ImageCarouselInnerProps, 'images'> {}

function ImageCarousel(props: ImageCarouselProps): ReactElement {
  return (
    <FastField name='images'>
      {({ field }: FastFieldProps) => (
        <ImageCarouselInner {...props} images={field.value} />
      )}
    </FastField>
  );
}

export default ImageCarousel;
