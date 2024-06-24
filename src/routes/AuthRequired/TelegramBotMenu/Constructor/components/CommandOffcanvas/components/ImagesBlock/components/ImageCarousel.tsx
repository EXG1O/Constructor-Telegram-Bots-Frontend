import React, {
	ReactElement,
	HTMLAttributes,
	CSSProperties,
	memo,
	useState,
	useMemo,
	useEffect,
} from 'react';

import classNames from 'classnames';

import Carousel from 'react-bootstrap/Carousel';

import useCommandOffcanvasStore from '../../../hooks/useCommandOffcanvasStore';

export type ImageCarouselProps = Omit<
	HTMLAttributes<HTMLDivElement>,
	'children' | 'onSelect'
>;

const carouselItemStyle: CSSProperties = { height: '200px' };

function ImageCarousel({
	className,
	...props
}: ImageCarouselProps): ReactElement<ImageCarouselProps> {
	const images = useCommandOffcanvasStore((state) => state.images);

	const [rawActiveIndex, setActiveIndex] = useState<number>(0);
	const activeIndex = useMemo<number>(
		() => (images.length <= rawActiveIndex ? rawActiveIndex - 1 : rawActiveIndex),
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
						src={image.url}
						className='w-100 object-fit-contain'
						style={carouselItemStyle}
					/>
				</Carousel.Item>
			))}
		</Carousel>
	) : (
		<></>
	);
}

export default memo(ImageCarousel);
