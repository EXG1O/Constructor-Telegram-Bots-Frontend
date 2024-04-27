import React, { ReactElement } from 'react';

import './Header.scss';

function Header(): ReactElement {
	return (
		<div className='header'>
			<h1 className='fw-semibold mb-1'>Constructor Telegram Bots</h1>
			<p className='lead mb-0'>
				{gettext(`
					Сайт, с помощью которого вы можете легко,
					бесплатно и без каких-либо знаний в программировании,
					создать своего многофункционального Telegram бота.
				`)}
			</p>
		</div>
	);
}

export default Header;