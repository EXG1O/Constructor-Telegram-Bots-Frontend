import React, { ReactElement, memo } from 'react';

import Modal, { ModalProps } from 'react-bootstrap/Modal';
import { QRCodeCanvas } from 'qrcode.react';

export type LoginModalProps = Omit<ModalProps, 'children'>;

function LoginModal(props: LoginModalProps): ReactElement<LoginModalProps> {
	return (
		<Modal {...props}>
			<Modal.Header closeButton className='border-bottom-0' />
			<Modal.Body className='text-center pt-0 pb-5'>
				<div className='d-flex justify-content-center mb-3'>
					<div className='border border-3 rounded-3 p-3'>
						<QRCodeCanvas
							size={256}
							value={`tg://resolve?domain=${process.env.TELEGRAM_BOT_USERNAME}&start=login`}
						/>
					</div>
				</div>
				<h3 className='fw-semibold mb-1'>{gettext('Telegram не открылся?')}</h3>
				<p className='mb-1'>{gettext('Отсканируйте QR-код с устройства на котором установлен Telegram.')}</p>
				<a
					href={`https://t.me/${process.env.TELEGRAM_BOT_USERNAME}?start=login`}
					target='_blank'
				>
					{gettext('Перейти по ссылке')}
				</a>
			</Modal.Body>
		</Modal>
	);
}

export default memo(LoginModal);