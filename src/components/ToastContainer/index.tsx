import React, { memo, ReactElement } from 'react';

import BaseToastContainer from 'react-bootstrap/ToastContainer';

export { createMessageToast } from './components/MessageToast';

import { useToastContainerStore } from './store';

function ToastContainer(): ReactElement {
	const toasts = useToastContainerStore((state) => state.toasts);

	return (
		<BaseToastContainer position='bottom-end' className='p-2'>
			{toasts}
		</BaseToastContainer>
	);
}

export default memo(ToastContainer);
