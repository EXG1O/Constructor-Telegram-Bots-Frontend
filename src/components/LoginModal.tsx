import React, { CSSProperties, memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeCanvas } from 'qrcode.react';

import Modal, { ModalProps } from './Modal';

import logoURL from 'assets/logo.svg?url';

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
	const { t } = useTranslation('components', { keyPrefix: 'loginModal' });

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
				<h3 className='fw-semibold'>{t('title')}</h3>
				<p>{t('text')}</p>
				<a
					href={`https://t.me/${process.env.TELEGRAM_BOT_USERNAME}?start=login`}
					rel='noreferrer'
					target='_blank'
				>
					{t('link')}
				</a>
			</Modal.Body>
		</Modal>
	);
}

export default memo(LoginModal);
