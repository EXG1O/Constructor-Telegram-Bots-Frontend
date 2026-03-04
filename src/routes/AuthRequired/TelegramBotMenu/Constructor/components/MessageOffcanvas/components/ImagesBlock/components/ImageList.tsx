import React, { type ReactElement } from 'react';
import { FastField, type FastFieldProps } from 'formik';

import ImageListInner, { type ImageListInnerProps } from './ImageListInner';

export interface ImageListProps extends Omit<ImageListInnerProps, 'form' | 'images'> {}

function ImageList(props: ImageListProps): ReactElement {
  return (
    <FastField name='images'>
      {({ field, form }: FastFieldProps) => (
        <ImageListInner {...props} form={form} images={field.value} />
      )}
    </FastField>
  );
}

export default ImageList;
