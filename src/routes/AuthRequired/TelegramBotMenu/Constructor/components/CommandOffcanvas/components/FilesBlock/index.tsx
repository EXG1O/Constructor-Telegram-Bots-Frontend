import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import AddFilesButton from './components/AddFilesButton';
import BlockCollapse from './components/BlockCollapse';
import FileList from './components/FileList';

import Block, { BlockProps } from '../../../Block';

export interface _File extends Pick<File, 'name' | 'size'> {
	id?: number;
	key: string;
	name: string;
	size: number;
	file: File | null;
	fromURL: string | null;
}

export type Files = _File[];

export type FilesBlockProps = Omit<BlockProps, 'title' | 'children'>;

export const defaultFiles: Files = [];

function FilesBlock(props: FilesBlockProps): ReactElement<FilesBlockProps> {
	const { t } = useTranslation('telegram-bot-menu-constructor', {
		keyPrefix: 'commandOffcanvas.filesBlock',
	});

	return (
		<BlockCollapse>
			<Block {...props} title={t('title')}>
				<Block.Body className='vstack gap-2'>
					<FileList />
					<AddFilesButton />
				</Block.Body>
			</Block>
		</BlockCollapse>
	);
}

export default memo(FilesBlock);
