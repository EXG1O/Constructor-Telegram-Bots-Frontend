import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Stack from 'components/Stack';

import AddImagesButton from './components/AddImagesButton';
import BlockCollapse from './components/BlockCollapse';
import ImageCarousel from './components/ImageCarousel';
import ImageList from './components/ImageList';
import ImagesLoading from './components/ImagesLoading';

import Block, { BlockProps } from '../../../Block';

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
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'commandOffcanvas.imagesBlock',
	});

	return (
		<BlockCollapse>
			<Block {...props} title={t('title')}>
				<Block.Body as={Stack} gap={2}>
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
