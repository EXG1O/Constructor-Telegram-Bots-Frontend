import React, { ReactElement, memo } from 'react';
import classNames from 'classnames';

import TelegramIcon from 'assets/icons/telegram.svg';
import GithubIcon from 'assets/icons/github.svg';

import Container from 'react-bootstrap/Container';

const baseLinkClassName: string = 'text-reset';

function Footer(): ReactElement {
	return (
		<footer className='py-2'>
			<Container>
				<div className='d-flex justify-content-between'>
					<span>&copy; 2024 exg1o</span>
					<div className='d-flex gap-1'>
						<a
							href='https://t.me/exg1o_channel'
							target='_blank'
							className={classNames(
								baseLinkClassName,
								'd-flex align-items-center',
							)}
						>
							<TelegramIcon />
						</a>
						<a
							href='https://github.com/EXG1O/Constructor-Telegram-Bots'
							target='_blank'
							className={classNames(
								baseLinkClassName,
								'd-flex align-items-center',
							)}
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
