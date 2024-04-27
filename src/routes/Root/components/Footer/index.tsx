import React, { ReactElement, memo } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import LinkGroup, { LinkGroupProps } from './components/LinkGroup';

const linkGroups: LinkGroupProps[] = [
	{
		title: gettext('Проект'),
		links: [
			{ type: 'default', href: 'https://github.com/EXG1O/Constructor-Telegram-Bots', children: 'GitHub' },
			{ type: 'default', href: 'https://github.com/EXG1O/Constructor-Telegram-Bots/blob/master/LICENSE.md', children: 'License' },
		],
	},
	{
		title: gettext('Контакты Основателя'),
		links: [
			{ type: 'default', href: 'mailto:helper.exg1o@gmail.com', children: 'helper.exg1o@gmail.com' },
			{ type: 'default', href: 'https://github.com/EXG1O', children: 'GitHub' },
			{ type: 'default', href: 'tg://resolve?domain=exg1o', children: 'Telegram' },
			{ type: 'default', href: 'tg://resolve?domain=exg1o_channel', children: 'Telegram Channel' },
		],
	},
	{
		title: gettext('Другое'),
		links: [
			{ type: 'react', to: '/privacy-policy/', children: 'Privacy Policy' },
		],
	},
];

function Footer(): ReactElement {
	return (
		<footer className='text-bg-dark'>
			<Container className='text-center py-2'>
				<Row xs={1} lg={3} className='gy-1 gy-lg-0'>
					{linkGroups.map((props, index) => (
						<LinkGroup key={index} {...props} />
					))}
				</Row>
				<Row className='justify-content-center'>
					<Col as='hr' xs={11} lg={7} className='text-white-50 my-2' />
					<span>&copy; 2024 exg1o</span>
				</Row>
			</Container>
		</footer>
	);
}

export default memo(Footer);