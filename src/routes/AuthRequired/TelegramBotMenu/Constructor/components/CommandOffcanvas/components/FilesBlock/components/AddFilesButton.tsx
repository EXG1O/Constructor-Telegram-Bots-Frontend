import React, { ReactElement, memo, useId } from 'react';

import Button, { ButtonProps } from 'react-bootstrap/Button';

import { createMessageToast } from 'components/ToastContainer';

import { _File } from '..';

import useCommandOffcanvasStore from '../../../hooks/useCommandOffcanvasStore';
import useTelegramBotStorage from '../../../hooks/useTelegramBotStorage';

export type AddFilesButtonProps = Omit<
	ButtonProps,
	'as' | 'htmlFor' | 'size' | 'variant' | 'children'
>;

function AddFilesButton(props: AddFilesButtonProps): ReactElement<AddFilesButtonProps> {
	const id = useId();

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
								message: interpolate(
									gettext('Файл %(name)s весит больше 2.5MB!'),
									{ name: file.name },
									true,
								),
								level: 'error',
							});
							return false;
						}

						if (availableStorageSize - file.size < 0) {
							createMessageToast({
								message: interpolate(
									gettext(
										'Невозможно добавить файл %(name)s, ' +
											'потому-что не хватает места в хранилище!',
									),
									{ name: file.name },
									true,
								),
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
				{gettext('Добавить файл')}
			</Button>
		</>
	);
}

export default memo(AddFilesButton);
