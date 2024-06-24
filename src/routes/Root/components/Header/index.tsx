import React, { ReactElement, CSSProperties, memo, useMemo } from 'react';

import classNames from 'classnames';
import { Link } from 'react-router-dom';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import Row from 'react-bootstrap/Row';

import Logo from 'assets/logo.svg';

import { reverse } from 'routes';

import useWindowSize from 'services/hooks/useWindowSize';

import Buttons from './components/Buttons';
import Links from './components/Links';

function Header(): ReactElement {
	const windowSize = useWindowSize();

	const isLargeWindowSize = useMemo<boolean>(
		() => windowSize.width < 992,
		[windowSize.width],
	);

	const linksColStyle = useMemo<CSSProperties>(
		() => ({ width: isLargeWindowSize ? 'calc(100% - 46px)' : undefined }),
		[isLargeWindowSize],
	);
	const linksClassName = useMemo<string>(
		() =>
			classNames('flex-nowrap justify-content-xl-center', {
				'overflow-x-auto': isLargeWindowSize,
			}),
		[isLargeWindowSize],
	);

	return (
		<nav className='py-2'>
			<Container>
				<Row className='g-2'>
					<Col xs='auto' xl='3'>
						<Link to={reverse('home')}>
							<Logo width={38} height={38} />
						</Link>
					</Col>
					<Col xs='auto' xl='6' style={linksColStyle}>
						<Links className={linksClassName} />
					</Col>
					<Col xs='auto' xl='3' className='flex-fill'>
						<Buttons />
					</Col>
				</Row>
			</Container>
		</nav>
	);
}

export default memo(Header);
