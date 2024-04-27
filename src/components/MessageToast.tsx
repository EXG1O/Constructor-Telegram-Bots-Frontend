import React, { ReactElement, memo, useEffect, useState } from 'react';

import Toast, { ToastProps } from 'react-bootstrap/Toast';
import CloseButton from 'react-bootstrap/CloseButton';

type Level = 'success' | 'info' | 'error';

export interface MessageToastProps extends Omit<ToastProps, 'autohide' | 'show' | 'delay' | 'className' | 'onClose' | 'children'> {
	message: string;
	level: Level;
}

const colors: Record<Level, string> = {
	success: 'success',
	info: 'primary',
	error: 'danger',
}
const icons: Record<Level, string> = {
	success: 'check-circle-fill',
	info: 'info-circle-fill',
	error: 'exclamation-triangle-fill',
}

function MessageToast({ message, level, ...props }: MessageToastProps): ReactElement<MessageToastProps> {
	const [show, setShow] = useState<boolean>(false);

	useEffect(() => setShow(true), []);

	return (
		<Toast
			{...props}
			autohide
			show={show}
			delay={6000}
			className={`text-bg-${colors[level]} mb-0`}
			onClose={() => setShow(false)}
		>
			<Toast.Body className='d-flex align-items-center gap-2'>
				<i className={`bi bi-${icons[level]}`} />
				<strong className='flex-fill text-break'>{message}</strong>
				<CloseButton onClick={() => setShow(false)} />
			</Toast.Body>
		</Toast>
	);
}

export default memo(MessageToast);