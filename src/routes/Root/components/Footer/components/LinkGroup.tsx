import React, { ReactElement, ReactNode, HTMLAttributes } from 'react';
import classNames from 'classnames';

import Col from 'react-bootstrap/Col';

import DefaultLink, { DefaultLinkProps as BaseDefaultLinkProps } from './DefaultLink';
import ReactLink, { ReactLinkProps as BaseReactLinkProps } from './ReactLink';

interface DefaultLinkProps extends BaseDefaultLinkProps {
	type: 'default';
}

interface ReactLinkProps extends BaseReactLinkProps {
	type: 'react';
}

type Link = DefaultLinkProps | ReactLinkProps;

export interface LinkGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
	title: ReactNode;
	links: Link[];
}

function LinkGroup({ title, links, className, ...props }: LinkGroupProps): ReactElement<LinkGroupProps> {
	return (
		<Col {...props} className={classNames('vstack', className)}>
			<h5 className='mb-0'>{title}</h5>
			{links.map((props, index) => {
				if (props.type === 'default') {
					return <DefaultLink key={index} {...props} />;
				} else if (props.type === 'react') {
					return <ReactLink key={index} {...props} />;
				}
			})}
		</Col>
	);
}

export default LinkGroup;