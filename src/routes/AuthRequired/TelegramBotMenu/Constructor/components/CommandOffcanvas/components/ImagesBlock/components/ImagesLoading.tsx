import React, { ReactElement, ReactNode, CSSProperties, memo } from 'react';

import Loading from 'components/Loading';

import useCommandOffcanvasStore from '../../../hooks/useCommandOffcanvasStore';

export interface ImagesLoadingProps {
	children: ReactNode;
}

const blockStyle: CSSProperties = { height: '202px' };

function ImagesLoading({
	children,
}: ImagesLoadingProps): ReactElement<ImagesLoadingProps> | ReactNode {
	const loading = useCommandOffcanvasStore((state) => state.imagesLoading);

	return loading ? (
		<div
			className='d-flex justify-content-center bg-light border rounded'
			style={blockStyle}
		>
			<Loading size='md' className='align-self-center' />
		</div>
	) : (
		children
	);
}

export default memo(ImagesLoading);
