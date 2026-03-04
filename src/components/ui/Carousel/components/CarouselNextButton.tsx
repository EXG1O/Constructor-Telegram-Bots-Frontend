import React, { forwardRef } from 'react';
import { ArrowRight } from 'lucide-react';

import CarouselDirectionButton, {
  type CarouselDirectionButtonProps,
} from './CarouselDirectionButton';

import type { EmblaAPI } from '..';

export interface CarouselNextButtonProps extends Omit<
  CarouselDirectionButtonProps,
  'onCanScroll' | 'onScroll'
> {}

const CarouselNextButton = forwardRef<HTMLButtonElement, CarouselNextButtonProps>(
  (props, ref) => {
    function handleCanScroll(api: EmblaAPI): boolean {
      return api.canScrollNext();
    }

    function handleScroll(api: EmblaAPI): void {
      api.scrollNext();
    }

    return (
      <CarouselDirectionButton
        {...props}
        ref={ref}
        className='right-2'
        onCanScroll={handleCanScroll}
        onScroll={handleScroll}
      >
        <ArrowRight />
      </CarouselDirectionButton>
    );
  },
);
CarouselNextButton.displayName = 'CarouselNextButton';

export default CarouselNextButton;
