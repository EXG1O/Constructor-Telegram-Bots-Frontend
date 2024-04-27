import React, { ReactElement, ReactNode, useMemo, useState } from 'react';

import ToastContainer from 'react-bootstrap/ToastContainer';

import MessageToast, { MessageToastProps } from 'components/MessageToast';

import ToastContext from 'services/contexts/ToastContext';

export interface ToastProviderProps {
	children: ReactNode;
}

function ToastProvider({ children }: ToastProviderProps): ReactElement<ToastProviderProps> {
	const [toasts, setToasts] = useState<ReactElement[]>([]);

	function deleteToast(key: string): void {
		setToasts(prevToasts => prevToasts.filter(toast => toast.key !== key));
	}

	function createMessageToast({ onExited, ...props }: MessageToastProps): void {
		const key: string = Date.now().toString();

		function handleExited(node: HTMLElement): void {
			deleteToast(key);
			onExited?.(node);
		}

		setToasts(prevToasts => [...prevToasts, <MessageToast key={key} {...props} onExited={handleExited} />]);
	}

	return (
		<ToastContext.Provider value={useMemo(() => ({ createMessageToast }), [])}>
			<ToastContainer className='vstack position-fixed bottom-0 end-0 gap-3 p-3'>
				{toasts}
			</ToastContainer>
			{children}
		</ToastContext.Provider>
	);
}

export default ToastProvider;