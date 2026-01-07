import React, { ReactElement, useEffect } from 'react';

import { Image } from '..';

import ItemImage, {
  ItemImageProps,
} from 'components/ui/Carousel/components/CarouselItem/components/ItemImage';

export interface ImageCarouselImageProps extends Omit<ItemImageProps, 'src'> {
  image: Image;
}

function ImageCarouselImage({
  image,
  ...props
}: ImageCarouselImageProps): ReactElement {
  useEffect(() => {
    return () => {
      if (!image.file_url) return;
      URL.revokeObjectURL(image.file_url);
    };
  }, [image.file_url]);

  return <ItemImage {...props} src={image.file_url ?? image.from_url ?? undefined} />;
}

export default ImageCarouselImage;
