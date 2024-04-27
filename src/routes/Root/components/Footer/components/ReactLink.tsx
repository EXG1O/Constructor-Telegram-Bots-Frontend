import React, { ReactElement, ReactNode } from 'react';
import classNames from 'classnames';

import { Link, LinkProps } from 'react-router-dom';

export interface ReactLinkProps extends LinkProps {
	children: ReactNode;
}

function ReactLink({ className, ...props }: ReactLinkProps): ReactElement<ReactLinkProps> {
	return <Link {...props} className={classNames('link-secondary link-underline-opacity-0', className)} />;
}

export default ReactLink;