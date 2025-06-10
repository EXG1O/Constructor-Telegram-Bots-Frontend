import React, { forwardRef, ImgHTMLAttributes } from 'react';

import cn from 'utils/cn';

export interface ItemImageProps extends ImgHTMLAttributes<HTMLImageElement> {}

const ItemImage = forwardRef<HTMLImageElement, ItemImageProps>(
  ({ className, ...props }, ref) => {
    return (
      <img
        {...props}
        ref={ref}
        className={cn('size-full', 'object-contain', className)}
      />
    );
  },
);
ItemImage.displayName = 'ItemImage';

export default ItemImage;
