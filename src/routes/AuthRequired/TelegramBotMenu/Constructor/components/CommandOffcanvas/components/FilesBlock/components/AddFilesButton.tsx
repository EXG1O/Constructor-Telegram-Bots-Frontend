import React, { memo, ReactElement, useId } from 'react';
import { useTranslation } from 'react-i18next';

import { _File } from '..';

import Button, { ButtonProps } from 'react-bootstrap/Button';

import { createMessageToast } from 'components/ToastContainer';

import useCommandOffcanvasStore from '../../../hooks/useCommandOffcanvasStore';
import useTelegramBotStorage from '../../../hooks/useTelegramBotStorage';

export type AddFilesButtonProps = Omit<
	ButtonProps,
	'as' | 'htmlFor' | 'size' | 'variant' | 'children'
>;

function AddFilesButton(props: AddFilesButtonProps): ReactElement<AddFilesButtonProps> {
	const id = useId();

	const { t } = useTranslation('telegram-bot-menu-constructor', {
		keyPrefix: 'commandOffcanvas.filesBlock.addFilesButton',
	});

	const updateFiles = useCommandOffcanvasStore((state) => state.updateFiles);

	const { remainingStorageSize } = useTelegramBotStorage();

	function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
		if (!event.target.files) return;

		const newFiles: File[] = Object.values(event.target.files);

		event.target.value = '';

		let availableStorageSize = remainingStorageSize;

		updateFiles((files) => {
			files.push(
				...newFiles
					.filter((file) => {
						if (file.size > 2621440) {
							createMessageToast({
								message: t('messages.addImages.error', {
									context: 'tooLarge',
									name: file.name,
								}),
								level: 'error',
							});
							return false;
						}

						if (availableStorageSize - file.size < 0) {
							createMessageToast({
								message: t('messages.addImages.error', {
									context: 'notEnoughStorage',
									name: file.name,
								}),
								level: 'error',
							});
							return false;
						}

						availableStorageSize -= file.size;

						return true;
					})
					.map<_File>((file) => ({
						key: crypto.randomUUID(),
						name: file.name,
						size: file.size,
						file,
						fromURL: null,
					})),
			);
		});
	}

	return (
		<>
			<input id={id} type='file' multiple hidden onChange={handleChange} />
			<Button {...props} as='label' htmlFor={id} size='sm' variant='dark'>
				{t('text')}
			</Button>
		</>
	);
}

export default memo(AddFilesButton);
