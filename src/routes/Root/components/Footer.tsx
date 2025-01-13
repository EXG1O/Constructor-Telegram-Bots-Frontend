import React, { memo, ReactElement } from 'react';

import Container from 'components/Container';

import GithubIcon from 'assets/icons/github.svg';
import TelegramIcon from 'assets/icons/telegram.svg';

const linkClassName: string = 'd-flex align-items-center text-reset';

function Footer(): ReactElement {
	return (
		<footer className='py-2'>
			<Container>
				<div className='d-flex justify-content-between'>
					<span>&copy; 2025 exg1o</span>
					<div className='d-flex gap-1'>
						<a
							href='https://t.me/exg1o_channel'
							rel='noreferrer'
							target='_blank'
							className={linkClassName}
						>
							<TelegramIcon />
						</a>
						<a
							href='https://github.com/EXG1O/Constructor-Telegram-Bots'
							rel='noreferrer'
							target='_blank'
							className={linkClassName}
						>
							<GithubIcon />
						</a>
					</div>
				</div>
			</Container>
		</footer>
	);
}

export default memo(Footer);
