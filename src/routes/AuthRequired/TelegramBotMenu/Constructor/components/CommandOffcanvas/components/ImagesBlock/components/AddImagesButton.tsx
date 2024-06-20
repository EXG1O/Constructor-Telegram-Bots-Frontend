import React, { ReactElement, memo, useId } from 'react';

import Button, { ButtonProps } from 'react-bootstrap/Button';

import { Image } from '..';

import { createMessageToast } from 'components/ToastContainer';

import useCommandOffcanvasStore from '../../../hooks/useCommandOffcanvasStore';
import useTelegramBotStorage from '../../../hooks/useTelegramBotStorage';

export type AddImagesButtonProps = Omit<
	ButtonProps,
	'as' | 'size' | 'variant' | 'htmlFor' | 'children'
>;

interface ProcessedImage extends File {
	url?: string;
}

function AddImagesButton(
	props: AddImagesButtonProps,
): ReactElement<AddImagesButtonProps> {
	const id = useId();

	const updateImages = useCommandOffcanvasStore((state) => state.updateImages);
	const setImagesLoading = useCommandOffcanvasStore(
		(state) => state.setImagesLoading,
	);

	const { remainingStorageSize } = useTelegramBotStorage();

	function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
		if (!event.target.files) return;

		setImagesLoading(true);

		const images: File[] = Object.values(event.target.files);
		let availableStorageSize: number = remainingStorageSize;

		event.target.value = '';

		const processedImages: ProcessedImage[] = images
			.filter((image) => {
				if (image.size > 2621440) {
					createMessageToast({
						message: interpolate(
							gettext('Изображение %(name)s весит больше 2.5МБ!'),
							{ name: image.name },
							true,
						),
						level: 'error',
					});
					return false;
				}

				if (availableStorageSize - image.size < 0) {
					createMessageToast({
						message: interpolate(
							gettext(
								'Невозможно добавить изображение %(name)s, ' +
									'потому-что не хватает места в хранилище!',
							),
							{ name: image.name },
							true,
						),
						level: 'error',
					});
					return false;
				}

				availableStorageSize -= image.size;

				return true;
			})
			.map((image, index) => {
				const fileRender = new FileReader();
				fileRender.readAsDataURL(image);
				fileRender.addEventListener('loadend', (e) => {
					if (e.target?.result) {
						processedImages[index].url = e.target.result.toString();
					} else {
						processedImages.splice(index, 1);
					}
				});

				return image;
			});

		const checkImagesResult = () => {
			for (const processedImage of processedImages) {
				if (!processedImage.url) {
					setTimeout(checkImagesResult, 500);
					return;
				}
			}

			updateImages((images) => {
				images.push(
					...processedImages.map<Image>((file) => ({
						key: crypto.randomUUID(),
						image: file,
						name: file.name,
						size: file.size,
						url: file.url!,
						fromURL: null,
					})),
				);
			});

			setImagesLoading(false);
		};

		checkImagesResult();
	}

	return (
		<>
			<input
				id={id}
				type='file'
				accept='image/*'
				multiple
				hidden
				onChange={handleChange}
			/>
			<Button {...props} as='label' size='sm' variant='dark' htmlFor={id}>
				{gettext('Добавить изображение')}
			</Button>
		</>
	);
}

export default memo(AddImagesButton);
