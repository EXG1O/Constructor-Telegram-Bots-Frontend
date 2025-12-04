import React, { ReactElement } from 'react';
import { FastField, FastFieldProps } from 'formik';

import ImageListInner, { ImageListInnerProps } from './ImageListInner';

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
