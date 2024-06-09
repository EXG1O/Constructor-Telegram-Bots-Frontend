import React, { ReactElement, memo } from 'react';

import Block, { BlockProps } from '../../../Block';

import BlockCollapse from './components/BlockCollapse';
import ImagesLoading from './components/ImagesLoading';
import ImageCarousel from './components/ImageCarousel';
import AddImagesButton from './components/AddImagesButton';

import ImageList from './components/ImageList';

export interface Image {
	id?: number;
	key: string;
	image: File | null;
	name: string;
	size: number;
	url: string;
	fromURL: string | null;
}

export type Images = Image[];

export type ImagesBlockProps = Omit<BlockProps, 'title' | 'children'>;

export const defaultImages: Images = [];

function ImagesBlock(props: ImagesBlockProps): ReactElement<ImagesBlockProps> {
	return (
		<BlockCollapse>
			<Block {...props} title={gettext('Изображение')}>
				<Block.Body className='vstack gap-2'>
					<ImagesLoading>
						<ImageCarousel />
						<ImageList />
					</ImagesLoading>
					<AddImagesButton />
				</Block.Body>
			</Block>
		</BlockCollapse>
	);
}

export default memo(ImagesBlock);
