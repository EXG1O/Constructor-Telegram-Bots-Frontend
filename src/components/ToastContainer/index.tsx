import React, { memo, ReactElement } from 'react';

import BaseToastContainer from 'react-bootstrap/ToastContainer';

import { useToastContainerStore } from './store';

import('./index.scss');

BaseToastContainer.displayName = 'BaseToastContainer';

export { createMessageToast } from './components/MessageToast';

function ToastContainer(): ReactElement {
	const toasts = useToastContainerStore((state) => state.toasts);

	return (
		<BaseToastContainer
			containerPosition='fixed'
			position='bottom-end'
			className='p-2'
		>
			{toasts}
		</BaseToastContainer>
	);
}

export default memo(ToastContainer);
