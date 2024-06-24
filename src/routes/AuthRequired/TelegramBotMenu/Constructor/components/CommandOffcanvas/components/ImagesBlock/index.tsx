import React, { ReactElement, memo } from 'react';

import Block, { BlockProps } from '../../../Block';

import AddImagesButton from './components/AddImagesButton';
import BlockCollapse from './components/BlockCollapse';
import ImageCarousel from './components/ImageCarousel';

import ImageList from './components/ImageList';
import ImagesLoading from './components/ImagesLoading';

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
