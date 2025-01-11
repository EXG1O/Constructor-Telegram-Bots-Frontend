import React, { memo, ReactElement, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useField } from 'formik';

import { Images } from '..';

import Carousel, { CarouselProps } from 'components/Carousel';

export type ImageCarouselProps = Pick<CarouselProps, 'className'>;

function ImageCarousel({
	className,
	...props
}: ImageCarouselProps): ReactElement<ImageCarouselProps> | null {
	const [{ value: images }] = useField<Images>('images');

	const [rawActiveIndex, setActiveIndex] = useState<number>(0);
	const activeIndex = useMemo<number>(
		() => (images.length < rawActiveIndex ? rawActiveIndex - 1 : rawActiveIndex),
		[images, rawActiveIndex],
	);

	useEffect(() => {
		if (activeIndex !== rawActiveIndex) {
			setActiveIndex(activeIndex);
		}
	}, [activeIndex]);

	return images.length ? (
		<Carousel
			{...props}
			variant='dark'
			interval={null}
			controls={images.length > 1}
			indicators={images.length > 1}
			activeIndex={activeIndex}
			className={classNames('bg-light overflow-hidden border rounded', className)}
			onSelect={(index) => setActiveIndex(index)}
		>
			{images.map((image) => (
				<Carousel.Item key={image.key}>
					<img
						height={200}
						src={image.url}
						className='w-100 object-fit-contain'
					/>
				</Carousel.Item>
			))}
		</Carousel>
	) : null;
}

export default memo(ImageCarousel);
