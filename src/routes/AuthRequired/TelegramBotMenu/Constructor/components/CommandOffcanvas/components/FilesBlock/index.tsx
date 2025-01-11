import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Stack from 'components/Stack';

import AddFilesButton from './components/AddFilesButton';
import FileList from './components/FileList';

import Block, { BlockProps } from '../../../Block';

export interface CustomFile extends Pick<File, 'name' | 'size'> {
	id?: number;
	key: string;
	name: string;
	size: number;
	file: File | null;
	from_url: string | null;
}

export type Files = CustomFile[];

export type FilesBlockProps = Pick<BlockProps, 'className'>;

export const defaultFiles: Files = [];

function FilesBlock(props: FilesBlockProps): ReactElement<FilesBlockProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'commandOffcanvas.filesBlock',
	});

	return (
		<Block.Collapse name='show_files_block'>
			<Block {...props} title={t('title')}>
				<Block.Body as={Stack} gap={2}>
					<FileList />
					<AddFilesButton />
				</Block.Body>
			</Block>
		</Block.Collapse>
	);
}

export default memo(FilesBlock);
