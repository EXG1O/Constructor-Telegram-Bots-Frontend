import React, { memo, ReactElement, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import { RouteID } from 'routes';

import { Image, Images } from '..';

import Button, { ButtonProps } from 'components/Button';
import { createMessageToast } from 'components/ToastContainer';

import useTelegramBotStorage from '../../../hooks/useTelegramBotStorage';

import { useCommandOffcanvasStore } from '../../../store';

export type AddImagesButtonProps = Pick<ButtonProps, 'className'>;

interface ProcessedImage extends File {
	url?: string;
}

function AddImagesButton(
	props: AddImagesButtonProps,
): ReactElement<AddImagesButtonProps> {
	const id = useId();

	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'commandOffcanvas.imagesBlock.addImagesButton',
	});

	const [{ value: images }, _meta, { setValue }] = useField<Images>('images');

	const setImagesLoading = useCommandOffcanvasStore(
		(state) => state.setImagesLoading,
	);

	const { remainingStorageSize } = useTelegramBotStorage();

	function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
		if (!event.target.files) return;

		setImagesLoading(true);

		const newImages: File[] = Object.values(event.target.files);
		let availableStorageSize: number = remainingStorageSize;

		event.target.value = '';

		const processedImages: ProcessedImage[] = newImages
			.filter((newImage) => {
				if (
					images.some(
						(image) =>
							newImage.name === image.name &&
							newImage.size === image.size,
					)
				) {
					return false;
				}

				if (newImage.size > 2621440) {
					createMessageToast({
						message: t('messages.addImages.error', {
							context: 'tooLarge',
							name: newImage.name,
						}),
						level: 'error',
					});
					return false;
				}

				if (availableStorageSize - newImage.size < 0) {
					createMessageToast({
						message: t('messages.addImages.error', {
							context: 'notEnoughStorage',
							name: newImage.name,
						}),
						level: 'error',
					});
					return false;
				}

				availableStorageSize -= newImage.size;

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
			setValue([
				...images,
				...processedImages.map<Image>((file) => ({
					key: crypto.randomUUID(),
					image: file,
					name: file.name,
					size: file.size,
					url: file.url!,
					from_url: null,
				})),
			]);

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
			<Button {...props} as='label' htmlFor={id} size='sm' variant='dark'>
				{t('text')}
			</Button>
		</>
	);
}

export default memo(AddImagesButton);
