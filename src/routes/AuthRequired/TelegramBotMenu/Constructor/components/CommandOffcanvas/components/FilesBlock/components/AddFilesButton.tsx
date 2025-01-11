import React, { memo, ReactElement, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import { produce } from 'immer';

import { RouteID } from 'routes';

import { CustomFile, Files } from '..';

import Button, { ButtonProps } from 'components/Button';
import { createMessageToast } from 'components/ToastContainer';

import useTelegramBotStorage from '../../../hooks/useTelegramBotStorage';

export type AddFilesButtonProps = Pick<ButtonProps, 'className'>;

function AddFilesButton(props: AddFilesButtonProps): ReactElement<AddFilesButtonProps> {
	const id = useId();

	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'commandOffcanvas.filesBlock.addFilesButton',
	});

	const [{ value: files }, _meta, { setValue }] = useField<Files>('files');

	const { remainingStorageSize } = useTelegramBotStorage();

	function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
		if (!event.target.files) return;

		const newFiles: File[] = Object.values(event.target.files);

		event.target.value = '';

		let availableStorageSize = remainingStorageSize;

		setValue(
			produce(files, (draft) => {
				draft.push(
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
						.map<CustomFile>((file) => ({
							key: crypto.randomUUID(),
							name: file.name,
							size: file.size,
							file,
							from_url: null,
						})),
				);
			}),
		);
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
