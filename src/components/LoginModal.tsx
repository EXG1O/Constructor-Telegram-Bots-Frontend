import React, { ReactElement, CSSProperties, memo } from 'react';

import { QRCodeCanvas } from 'qrcode.react';

import logoURL from 'assets/logo.svg?url';

import Modal, { ModalProps } from './Modal';

export type LoginModalProps = Omit<ModalProps, 'children'>;

type ImageSettings = Parameters<typeof QRCodeCanvas>[0]['imageSettings'];

const modalBodyStyle: CSSProperties = { paddingBottom: '42px' };

const imageSettings: ImageSettings = {
	src: logoURL,
	height: 65,
	width: 65,
	excavate: true,
};

function LoginModal(props: LoginModalProps): ReactElement<LoginModalProps> {
	return (
		<Modal {...props}>
			<Modal.Header closeButton className='border-bottom-0' />
			<Modal.Body
				className='vstack text-center px-4 pt-0 gap-1'
				style={modalBodyStyle}
			>
				<QRCodeCanvas
					size={256}
					value={`tg://resolve?domain=${process.env.TELEGRAM_BOT_USERNAME}&start=login`}
					imageSettings={imageSettings}
					className='align-self-center'
				/>
				<h3 className='fw-semibold'>{gettext('Telegram не открылся?')}</h3>
				<p>
					{gettext(
						'Отсканируйте QR-код с устройства на ' +
							'котором установлен Telegram.',
					)}
				</p>
				<a
					href={`https://t.me/${process.env.TELEGRAM_BOT_USERNAME}?start=login`}
					rel='noreferrer'
					target='_blank'
				>
					{gettext('Перейти по ссылке')}
				</a>
			</Modal.Body>
		</Modal>
	);
}

export default memo(LoginModal);
