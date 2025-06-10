import React, { forwardRef, useEffect, useState } from 'react';

import { EmblaAPI } from '..';

import IconButton, { IconButtonProps } from 'components/ui/IconButton';

import useCarousel from '../hooks/useCarousel';

import cn from 'utils/cn';

export interface CarouselDirectionButtonProps
  extends Omit<IconButtonProps, 'size' | 'onScroll'> {
  onCanScroll: (api: EmblaAPI) => boolean;
  onScroll: (api: EmblaAPI) => void;
}

const CarouselDirectionButton = forwardRef<
  HTMLButtonElement,
  CarouselDirectionButtonProps
>(({ className, onCanScroll, onScroll, onClick, ...props }, ref) => {
  const { api } = useCarousel();

  const [canScroll, setCanScroll] = useState<boolean>(api ? onCanScroll(api) : false);

  function onSelect(api: EmblaAPI): void {
    setCanScroll(onCanScroll(api));
  }

  useEffect(() => {
    if (!api) return;

    onSelect(api);
    api.on('reInit', onSelect);
    api.on('select', onSelect);
    return () => {
      api.off('reInit', onSelect);
      api.off('select', onSelect);
    };
  }, [api]);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
    if (api) {
      onScroll(api);
    }
    onClick?.(event);
  }

  return (
    <IconButton
      {...props}
      ref={ref}
      size='lg'
      className={cn(
        !canScroll && 'hidden',
        'absolute',
        'top-1/2',
        '-translate-y-1/2',
        'bg-background',
        'text-foreground',
        'border',
        'border-outline',
        'rounded-full',
        'p-1',
        'shadow-xs',
        'hover:bg-gray-100',
        className,
      )}
      onClick={handleClick}
    />
  );
});
CarouselDirectionButton.displayName = 'CarouselDirectionButton';

export default CarouselDirectionButton;
