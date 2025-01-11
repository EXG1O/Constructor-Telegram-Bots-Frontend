import React, { CSSProperties, memo, ReactElement, useMemo } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { reverse, RouteID } from 'routes';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Container from 'components/Container';

import Buttons from './components/Buttons';
import Links from './components/Links';

import useWindowSize from 'hooks/useWindowSize';

import Logo from 'assets/logo.svg';

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
						<Link to={reverse(RouteID.Home)}>
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
